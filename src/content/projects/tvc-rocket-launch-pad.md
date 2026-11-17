---
title: TVC Rocket + Launch Pad
summary: Thrust-vector-controlled rocket with an integrated launch system.
cover: ../../assets/media/tvc-cover-flight4-liftoff.jpg
coverAlt: The TVC rocket lifting off its launch pad as the tower arm swings clear, with exhaust smoke spreading across the ground
startDate: 2026
endDate: 2026
---

<!-- DRAFT: all text on this page is a stand-in for Trevor to rewrite. -->

<p class="caption"><em>This project is in progress. The page will grow as the next version comes together.</em></p>

## Overview

<div class="media-row narrow-first">
<div>
<video src="/media/tvc-flight4-padcam.mp4" poster="/media/tvc-flight4-padcam.jpg" width="720" height="1280" controls playsinline preload="metadata" aria-label="Pad camera view of the TVC rocket launching from its tower"></video>
</div>
<div>

This is my most ambitious project so far: an actively stabilized, thrust-vector-controlled rocket
with its own launch system. When I started, I had no background in embedded software or control
systems. The flight computer, its firmware, the control loop, and the launch pad were all learned
and built along the way.

Over four test flights, the rocket has gone from a bare launch rod to a full pad with remote
ignition and a retracting tower arm, and each flight has pointed to what to fix next.

</div>
</div>

## Design

<div class="media-row">
<div>

The rocket steers by vectoring its motor's thrust. A custom flight computer estimates the
rocket's attitude in real time and runs a PD controller to keep it pointed upright, while a flight
state machine detects launch, burnout, and apogee to trigger parachute deployment.

The launch pad has its own computer for remote ignition, a servo-actuated tower arm that retracts
at launch, and pad status indication.

</div>
<div>

![CAD model of the TVC rocket on its launch pad, held by the tower arm](../../assets/media/TVC_Launch_PAD_CAD.PNG)

</div>
</div>

From the bottom up, the rocket is a lower body tube, a coupler, the flight computer mount, the
3D-printed recovery system, and the nose cone.

![Exploded CAD view of the rocket, labeled from left to right: lower body tube, coupler, flight computer mount, recovery system, and nose cone](../../assets/media/tvc-rocket-cad-labeled.png)

<p class="caption"><em>Exploded view of the rocket (TVC mount, springs, and servo not shown)</em></p>

<div class="media-row">
<div>

![CAD of the spring-loaded recovery system, labeled: attachment blocks, guide rails, parachute canister, spring base plate, catch, latch, servo mount, and servo](../../assets/media/tvc-recovery-cad-servo-labeled.png)

<p class="caption"><em>Recovery system (springs not shown)</em></p>

</div>
<div>

The recovery system is spring-loaded. Springs compressed against the base plate push the nose
cone and parachute canister out along four guide rails. Until then, a latch hooked onto a catch
holds everything closed, and at apogee a servo swings the latch free to release it.

The mechanism deployed the parachute on two of the four flights and was prone to jamming, which is
why the next version moves to pyrotechnic ejection.

</div>
</div>

## Flight Computer

### V1

<div class="media-row two-media">
<div>

![Front of flight computer V1: perfboard with the microcontroller and sensor boards, mounted in a 3D-printed sled](../../assets/media/tvc-fc-v1-front-cutout.webp)

<p class="caption"><em>Front</em></p>

</div>
<div>

![Back of flight computer V1 in its 3D-printed sled](../../assets/media/tvc-fc-v1-back.jpg)

<p class="caption"><em>Back</em></p>

</div>
<div>

The first flight computer was hand-wired on perfboard around an STM32 microcontroller, with an
IMU, a barometer, and flash memory for data logging. In bare-metal C, it ran a Mahony attitude
filter and a 3-state Kalman filter at 200 Hz, fusing IMU and barometer data to estimate
orientation, altitude, and vertical velocity. V1 flew on flights 1 and 2. After flight 2, the
flight data showed that vibration was corrupting the gyroscope readings.

</div>
</div>

### V2

<div class="media-row two-media">
<div>

![Front of flight computer V2 in a taller 3D-printed sled](../../assets/media/tvc-fc-v2-front.jpg)

<p class="caption"><em>Front</em></p>

</div>
<div>

![Back of flight computer V2 in its 3D-printed sled](../../assets/media/tvc-fc-v2-back.jpg)

<p class="caption"><em>Back</em></p>

</div>
<div>

V2 was a rebuilt board that flew on flights 3 and 4. The vibration problem persisted, which is
driving the move to a custom PCB with rubber isolation mounts.

</div>
</div>

## Flight Tests

### Flight 1

<div class="media-row narrow-first">
<div>
<video src="/media/tvc-flight1.mp4" poster="/media/tvc-flight1.jpg" width="720" height="1280" controls playsinline preload="metadata" aria-label="Flight 1 of the TVC rocket"></video>
</div>
<div>

The first flight, launched from a simple rod before the launch pad existed, with flight computer
V1 on board.

</div>
</div>

### Flight 2

<div class="media-row two-media">
<div>
<video src="/media/tvc-flight2.mp4" poster="/media/tvc-flight2.jpg" width="720" height="1280" controls playsinline preload="metadata" aria-label="Flight 2 of the TVC rocket at Lucerne Dry Lake"></video>
</div>
<div>

![Trevor preparing the rocket on its pad on a dry lakebed](../../assets/media/tvc-lucerne-pad-prep.jpg)

<p class="caption"><em>Prepping for flight 2</em></p>

</div>
<div>

Flown at Lucerne Dry Lake. Shortly after liftoff, the rocket pitched over nearly 90 degrees
before recovering, and the parachute did not deploy. The data from this flight pointed to
vibration corrupting V1's gyroscope readings.

</div>
</div>

The flight log tells the story of the pitch-over. The commanded gimbal deflection sat at its ±6°
limit for about 80% of the burn on both axes (the SAT flags), and the tilt from vertical kept
growing after burnout. The rocket reached about 60 m, and the ejection command fired after
apogee, but the spring-loaded system did not release the parachute.

<div class="plot">
<a href="/media/tvc-flight2-plots-overview.png" target="_blank" rel="noopener"><img src="/media/tvc-flight2-plots-overview.png" alt="Flight 2 overview plots: altitude, vertical velocity, vertical acceleration, angle from vertical, attitude error, and commanded gimbal deflection versus time" width="1980" height="1710" loading="lazy" decoding="async"></a>
<p class="caption"><em>Flight 2 overview, from liftoff through the start of descent. Click to enlarge.</em></p>
</div>

<div class="plot">
<a href="/media/tvc-flight2-plots-detail.png" target="_blank" rel="noopener"><img src="/media/tvc-flight2-plots-detail.png" alt="Flight 2 detail plots: body angular rates, raw accelerometer, servo pulse widths, and log flags versus time" width="1980" height="1980" loading="lazy" decoding="async"></a>
<p class="caption"><em>Flight 2 detail: body rates, raw accelerometer, servo commands, and log flags. Click to enlarge.</em></p>
</div>

### Flight 3

<div class="media-row narrow-first">
<div>
<video src="/media/tvc-flight3-tracking.mp4" poster="/media/tvc-flight3-tracking.jpg" width="720" height="1280" controls playsinline preload="metadata" aria-label="Flight 3 of the TVC rocket"></video>
</div>
<div>

The first flight with flight computer V2. The parachute deployed and the rocket was recovered.

</div>
</div>

### Flight 4

<div class="media-row narrow-first">
<div>
<video src="/media/tvc-flight4.mp4" poster="/media/tvc-flight4.jpg" width="720" height="1280" controls playsinline preload="metadata" aria-label="Flight 4 of the TVC rocket"></video>
</div>
<div>

Flown later the same day as flight 3 (the pad camera view is at the top of this page). The
parachute did not deploy and the rocket was destroyed. With the vibration problem still present
and the spring-loaded ejection system working on only two of four flights, this flight set the
direction for the next version.

</div>
</div>

Flights 3 and 4 flew nearly identically, so the log from flight 3 is shown here. With flight
computer V2, control during the burn was much better than on flight 2: tilt stayed within about
11° of vertical for the entire burn, gimbal saturation dropped from about 80% of the burn to 58%
and 29% on the two axes, and the rocket reached about 77 m. After burnout, with no thrust left to
steer, the rocket tipped to about 70° during coast.

<div class="plot">
<a href="/media/tvc-flight3-plots-overview.png" target="_blank" rel="noopener"><img src="/media/tvc-flight3-plots-overview.png" alt="Flight 3 overview plots: altitude, vertical velocity, vertical acceleration, angle from vertical, attitude error, and commanded gimbal deflection versus time" width="1980" height="1710" loading="lazy" decoding="async"></a>
<p class="caption"><em>Flight 3 overview, from liftoff through the start of descent. Click to enlarge.</em></p>
</div>

<div class="plot">
<a href="/media/tvc-flight3-plots-detail.png" target="_blank" rel="noopener"><img src="/media/tvc-flight3-plots-detail.png" alt="Flight 3 detail plots: body angular rates, raw accelerometer, servo pulse widths, and log flags versus time" width="1980" height="1980" loading="lazy" decoding="async"></a>
<p class="caption"><em>Flight 3 detail: body rates, raw accelerometer, servo commands, and log flags. Click to enlarge.</em></p>
</div>

## What's Next

- **Custom PCB with vibration isolation.** Moving the flight computer from perfboard to a custom
  PCB, mounted on rubber isolators to keep vibration out of the IMU.
- **Pyrotechnic parachute ejection.** Replacing the custom spring-loaded ejection mechanism, which
  was prone to jamming, with a standard pyro-based system.

## Media Gallery

<div class="gallery">
<figure>

![The rocket hanging horizontally from two strings in a living room](../../assets/media/tvc-inertia-test-1.jpg)

<figcaption>Bifilar pendulum test to measure the rocket's moment of inertia for controller tuning</figcaption>
</figure>
<figure>

![A second view of the rocket suspended from the ceiling by two strings](../../assets/media/tvc-inertia-test-2.jpg)

<figcaption>Bifilar pendulum test, second view</figcaption>
</figure>
<figure>

![Workbench covered in launch pad drawings and aluminum parts](../../assets/media/tvc-launch-pad-build.jpg)

<figcaption>Building the launch pad from aluminum stock in the workshop</figcaption>
</figure>
</div>
