"""Re-draw the TVC flight log plots sized for the website.

Loads decode_flight_log.py from the TVC flight software repo (read-only; nothing is added
there) and reuses its parsing, trimming and derived quantities. Only the presentation changes:
smaller figure, larger text, thicker lines, axes fitted to the plotted window, no suptitle,
a legend for the flight-phase shading, and only the log flags that actually fired.

Writes two PNGs: <out prefix>-overview.png and <out prefix>-detail.png

    python scripts/export_flight_plots.py <decoder.py> <capture.log> <flight #> <out prefix>

<flight #> is the decoder's numbering within that capture (it counts power cycles), not the
flight-test number. Example, Flight 2 (the first flight in its capture):

    python scripts/export_flight_plots.py ^
        C:/dev/TVC-Flight-Software/TVC_Flight_Software/tools/decode_flight_log.py ^
        C:/dev/TVC-Flight-Software/flight_2/capture.log 1 public/media/tvc-flight2-plots

Requires numpy and matplotlib (the same as the decoder).
"""
import importlib.util
import sys

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Patch
import numpy as np

decoder_path, capture, flight_no, out_prefix = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
# Don't leave a __pycache__ folder next to the decoder in the TVC repo
sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location("decoder", decoder_path)
dec = importlib.util.module_from_spec(spec)
spec.loader.exec_module(dec)

plt.rcParams.update({
    "font.size": 13,
    "axes.titlesize": 14,
    "axes.labelsize": 13,
    "xtick.labelsize": 12,
    "ytick.labelsize": 12,
    "legend.fontsize": 11,
    "lines.linewidth": 1.8,
    "axes.titleweight": "bold",
})

records = dec.parse_records(dec.extract_hex(capture))
flight = dec.split_flights(records)[flight_no - 1]
data = dec.to_arrays(flight)
# Half a second of pad before BOOST through half a second after DESCENT
data, window = dec.trim_flight(data, pre_boost=0.5, post_descent=0.5)
t = data["t"]

PHASES = [(1, "Pad", "#e8f0fe"), (2, "Boost", "#ffe8e0"), (3, "Coast", "#e8f8e8"), (4, "Descent", "#f0e8f8")]


def phase_legend(fig):
    handles = [Patch(facecolor=c, edgecolor="#bbbbbb", label=n) for _, n, c in PHASES]
    fig.legend(handles=handles, loc="upper center", ncol=4, frameon=False,
               bbox_to_anchor=(0.5, 1.0), fontsize=12, title=None)


def finish(ax, ylabel, title):
    dec.shade_states(ax, data)
    ax.set_ylabel(ylabel)
    ax.set_title(title)
    ax.grid(alpha=0.3)
    ax.set_xlim(t[0], t[-1])


# --- Overview: the same six panels as plot_overview() ---
fig, axes = plt.subplots(3, 2, figsize=(11, 9.5), sharex=True)

ax = axes[0, 0]; ax.plot(t, data["kf_h"]); finish(ax, "Altitude (m)", "Altitude")
ax = axes[0, 1]; ax.plot(t, data["kf_v"], color="tab:orange"); ax.axhline(0, color="k", lw=0.6)
finish(ax, "Velocity (m/s)", "Vertical Velocity")
ax = axes[1, 0]; ax.plot(t, data["lin_accel_z"], color="tab:red", lw=1.2); ax.axhline(0, color="k", lw=0.6)
finish(ax, "Accel (m/s²)", "Vertical Acceleration")
ax = axes[1, 1]; ax.plot(t, data["tilt_deg"], color="tab:green"); finish(ax, "Tilt (deg)", "Angle From Vertical")
ax = axes[2, 0]
ax.plot(t, np.degrees(data["err_y"]), label="err_y"); ax.plot(t, np.degrees(data["err_z"]), label="err_z")
ax.axhline(0, color="k", lw=0.6); finish(ax, "Error (deg)", "Attitude Error"); ax.set_xlabel("Time (s)")
ax.legend(loc="lower left")
ax = axes[2, 1]
ax.plot(t, data["cmd_y"], label="cmd_y", lw=1.4); ax.plot(t, data["cmd_z"], label="cmd_z", lw=1.4)
ax.axhline(6.0, color="r", ls="--", lw=1.0, label="±6° limit"); ax.axhline(-6.0, color="r", ls="--", lw=1.0)
ax.set_ylim(-7.5, 7.5); finish(ax, "Gimbal (deg)", "Commanded Gimbal Deflection"); ax.set_xlabel("Time (s)")
ax.legend(loc="lower right", bbox_to_anchor=(1.0, 0.12), ncol=1)

phase_legend(fig)
fig.tight_layout(rect=(0, 0, 1, 0.96))
fig.savefig(out_prefix + "-overview.png", dpi=180, facecolor="white")

# --- Detail: the same four panels as plot_detail(); flags limited to ones that fired ---
fig, axes = plt.subplots(4, 1, figsize=(11, 11), sharex=True)

ax = axes[0]
for name in ("wx", "wy", "wz"):
    ax.plot(t, np.degrees(data[name]), lw=1.2, label=name)
finish(ax, "Rate (deg/s)", "Body Angular Rates"); ax.legend(ncol=3, loc="upper left")
ax = axes[1]
for name in ("ax_g", "ay_g", "az_g"):
    ax.plot(t, data[name], lw=1.2, label=name)
finish(ax, "Accel (g)", "Raw Accelerometer, Body Frame"); ax.legend(ncol=3, loc="upper right")
ax = axes[2]
ax.plot(t, data["pulse_y"], label="pulse_y (mount Y)"); ax.plot(t, data["pulse_z"], label="pulse_z (mount X)")
ax.axhline(1600, color="tab:blue", ls=":", lw=1.0); ax.axhline(1875, color="tab:orange", ls=":", lw=1.0)
finish(ax, "Pulse (µs)", "Servo Pulse Widths (dotted = trim)"); ax.legend(loc="lower right", ncol=2)
ax = axes[3]
dec.shade_states(ax, data)
fired = [(bit, name) for bit, name, _ in dec.FLAG_BITS if np.any(data["flags"] & bit)]
for row, (bit, name) in enumerate(fired):
    hits = np.where(data["flags"] & bit)[0]
    ax.plot(t[hits], np.full(len(hits), row), "|", ms=12)
ax.set_yticks(range(len(fired))); ax.set_yticklabels([n for _, n in fired])
ax.set_ylim(-0.5, len(fired) - 0.5); ax.set_xlim(t[0], t[-1])
ax.set_title("Log Flags"); ax.grid(alpha=0.3, axis="x"); ax.set_xlabel("Time (s)")

phase_legend(fig)
fig.tight_layout(rect=(0, 0, 1, 0.965))
fig.savefig(out_prefix + "-detail.png", dpi=180, facecolor="white")

print(f"window {window[0]:.2f}-{window[1]:.2f} s; flags shown: {[n for _, n in fired]}")
