# Motion research (v13)

The brief, Nov 18: "can you make the animations in cards more fluid like apples motion graphics".
These notes cover what Apple actually does and how it maps onto the cards' motion system (`_motion/motion.js`, synced into every template).

## What Apple says

**Human Interface Guidelines, Motion** ([developer.apple.com/design/human-interface-guidelines/motion](https://developer.apple.com/design/human-interface-guidelines/motion))
- "Add motion purposefully, supporting the experience without overshadowing it." Gratuitous motion distracts and can make people physically uncomfortable.
- "Aim for brevity and precision in feedback animations." Brief, precise feedback "tends to feel lightweight and unobtrusive".
- "In apps, generally avoid adding motion to UI interactions that occur frequently." A custom control shouldn't make people watch the same flourish every time.
- "Let people cancel motion. As much as possible, don't make people wait for an animation to complete before they can do anything."
- "Make motion optional." Never the only carrier of information; respect Reduce Motion. For relocations, visionOS guidance suggests fading out and back in instead of travelling, which is also the usual Reduce Motion substitute.

**WWDC18 "Designing Fluid Interfaces"** ([developer.apple.com/videos/play/wwdc2018/803](https://developer.apple.com/videos/play/wwdc2018/803/); written up by Nathan Gitter, [Building Fluid Interfaces](https://medium.com/@nathangitter/building-fluid-interfaces-ios-swift-9732bb934bf5))
- Fluid interfaces are responsive, interruptible and redirectable: a moving element can be grabbed or retargeted mid-flight and reverses without waiting.
- Springs are described with two designer-facing numbers, damping (bounciness) and response (speed), instead of mass/stiffness/damping. Damping 1.0 (no bounce) is the default for most UI; bounce is earned by momentum (a flick, a throw) or used for playful confirmation.
- Momentum: the release velocity of a gesture is handed to the spring as its starting velocity, so motion continues the finger instead of restarting.

**WWDC23 "Animate with springs"** ([developer.apple.com/videos/play/wwdc2023/10158](https://developer.apple.com/videos/play/wwdc2023/10158/))
- Springs are configured by perceptual duration and bounce: mass = 1, stiffness = (2π / duration)², damping = 4π(1 − bounce) / duration for bounce ≥ 0. Bounce 0 is the smooth default; Apple's presets are `.smooth` (bounce 0), `.snappy` (a little bounce) and `.bouncy` (more bounce).
- "A spring animation uses the velocity it had when it was retargeted as the initial velocity towards its new destination and this same velocity preservation makes these kind of interruptions feel smooth and natural."
- "Springs are the only type of animation that maintains continuity both for static cases and cases with an initial velocity." An ease curve has no way to carry an initial velocity; linear has a velocity jump.
- Perceptual duration vs settling duration: don't wait for the spring's long tail before making user-facing changes.

**How iOS animates the pieces we have** (UIKit/SwiftUI behaviour)
- List insert, remove and row-height changes: `UITableView.performBatchUpdates` animates the changed row's height and slides every row below it in the same transaction ([docs](https://developer.apple.com/documentation/uikit/uitableview/performbatchupdates(_:completion:))). Nothing below the row jumps; the row itself reveals or hides its new height. That is what the cards' expand/collapse now does with FLIP + clip.
- Expand and collapse of disclosure content: the content fades and slides a few points with the reveal; on collapse it fades early so the closing edge never runs over legible text.
- Toggles and checkmarks: a short spring with a small overshoot (UISwitch thumb, Reminders' circle fill). One beat, under a third of a second.
- Number changes: `.contentTransition(.numericText(countsDown:))` rolls only the digits that change, up when counting up and down when counting down, and needs an animation context ([ContentTransition docs](https://developer.apple.com/documentation/swiftui/contenttransition)).
- Tabs and segmented controls: the selection thumb slides on a spring; page content moves in the direction of travel.
- Toasts, banners and sheets spring in from the edge they belong to and leave quickly.

**On the web** ([Chrome: CSS linear() easing](https://developer.chrome.com/docs/css-ui/css-linear-easing-function), [Josh W. Comeau: linear()](https://joshwcomeau.com/animation/linear-timing-function), [pqina: CSS spring animation with linear()](https://pqina.nl/blog/css-spring-animation-with-linear-easing-function/))
- `linear()` approximates any curve, overshoot included, with a list of points; with an explicit duration it turns a sampled spring into a CSS/WAAPI easing that runs on the compositor. Supported in Chrome/Edge 113, Firefox 112, Safari 17.2; we fall back to a cubic-bezier where it isn't.

## The cards' motion system

Three springs, sampled at runtime from the damped-spring equation (response, damping fraction; SwiftUI's bounce ≈ 1 − damping fraction). Faster than SwiftUI's 0.5s defaults because the cards are small surfaces and the brief caps direct feedback at about 350ms.

| Preset | Response, damping (≈ bounce) | Settles in | Used for |
|---|---|---|---|
| `snappy` | 0.25s, 0.86 (≈ .15, Apple's `.snappy`) | 250ms (95% at 150ms) | press, toggle, option select, segmented thumbs |
| `smooth` | 0.30s, 1.0 (0, Apple's `.smooth`) | 360ms (95% at 230ms) | expand/collapse, FLIP moves, tab content, number rolls, entry |
| `bouncy` | 0.32s, 0.68 (≈ .3, Apple's `.bouncy`) | 95% at 145ms, 5% overshoot, settled by 355ms | tick pop, toast in |

Fixed durations where a spring is wrong: fades out 150–160ms (exits shouldn't linger), reduced-motion crossfades 150ms.

Rules
1. Only transform, opacity and clip-path animate. Layout changes happen once, then FLIP (First, Last, Invert, Play) animates the difference.
2. Interruptible: every animation starts from where the element is on screen now. Expand/collapse also carries its current velocity into the new spring, as Apple's springs do.
3. Entry happens once per card (a 12px rise and fade, rows staggered 24ms, capped at 8), not on every re-render.
4. Reduced motion: no travel, scale or overshoot; changes crossfade in 150ms.
5. Behavior, data contract and every sendPrompt payload are untouched; motion is presentation only.
