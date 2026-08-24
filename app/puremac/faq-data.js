export const pureMacFaqs = [
  {
    question: "What is PureMac?",
    answer:
      "PureMac is a small collection of native macOS apps by Yashashwi Singhania. Each app focuses on one job, uses native Mac technologies instead of Electron, and is published with source code you can inspect or build yourself.",
  },
  {
    question: "Which Mac apps are available from PureMac?",
    answer:
      "PureMac currently includes Arras, a desktop photo widget app that preserves each image's aspect ratio, and Fadeo, a workflow audio app that automatically changes sound to match the app, Space, meeting, Focus mode, or schedule you are using.",
  },
  {
    question: "Are PureMac apps free to use?",
    answer:
      "Yes. Arras is free forever, and Fadeo remains fully functional without a license. Fadeo also offers an optional pay-what-you-want lifetime license that removes an occasional reminder.",
  },
  {
    question: "Are PureMac apps open source?",
    answer:
      "Yes. Arras is released under the MIT License and Fadeo under GPLv3. Their source code and release history are available on GitHub, so you can audit the code, report issues, fork a project, or build the apps yourself.",
  },
  {
    question: "Do PureMac apps use Electron?",
    answer:
      "No. PureMac apps are native macOS software rather than web apps wrapped in Electron. That keeps them small, responsive, and closely integrated with Mac features such as desktop windows, Spaces, Focus modes, and media controls.",
  },
  {
    question: "Do PureMac apps collect telemetry?",
    answer:
      "PureMac does not build its apps around background tracking. Arras sends nothing home. Fadeo makes its workflow decisions locally and only sends limited information for actions such as license activation, optional diagnostics, feedback, or a mailing-list signup.",
  },
  {
    question: "What version of macOS do PureMac apps require?",
    answer:
      "The current Arras and Fadeo releases require macOS 14 or later. Arras currently requires Apple Silicon; check each product page and GitHub release before downloading because compatibility can change between versions.",
  },
  {
    question: "How do I install a PureMac app?",
    answer:
      "Download the latest DMG from the app's PureMac page or GitHub release. Arras can also be installed through Yashashwi's Homebrew tap. The product page lists the exact installation steps and any one-time Gatekeeper action.",
  },
  {
    question: "Why can macOS show a Gatekeeper warning for a PureMac download?",
    answer:
      "The apps are ad-hoc signed and distributed outside the Mac App Store. macOS may therefore ask you to approve the app once in Privacy & Security. The warning reflects the distribution method, and you can inspect the public source before deciding to run it.",
  },
  {
    question: "Are PureMac apps subscription based?",
    answer:
      "No. Arras has no charge, and Fadeo's optional license is a one-time lifetime purchase rather than a recurring subscription. Both apps can be downloaded and run without creating an account.",
  },
];

export const arrasFaqs = [
  {
    question: "What is Arras for macOS?",
    answer:
      "Arras is a native macOS desktop photo widget app. It places photos in individual, movable windows while preserving their original proportions, so panoramas, portraits, square images, and GIFs do not have to fit a fixed widget grid.",
  },
  {
    question: "How is Arras different from the built-in macOS photo widget?",
    answer:
      "The built-in macOS widget uses a few fixed rectangle sizes and may crop an image to fill them. Arras sizes each desktop photo window to the image's own aspect ratio, avoiding unwanted cropping, black bars, letterboxing, and padding.",
  },
  {
    question: "Can Arras display photos at any aspect ratio?",
    answer:
      "Yes. Each Arras widget has independent dimensions, so ultra-wide panoramas, 16:9 landscapes, square photos, portraits, and other custom aspect ratios keep their intended shape on your Mac desktop.",
  },
  {
    question: "Where can I position an Arras photo widget?",
    answer:
      "You can place a photo behind desktop icons, above desktop icons, over Apple's own widgets, or above other app windows. Arras also provides snapping guides for screen edges, nearby photos, and other application windows.",
  },
  {
    question: "Can Arras rotate several photos in one widget?",
    answer:
      "Yes. Select multiple images to create a rotating desktop photo widget that crossfades on click or on a timed interval, including every 30 seconds, hourly, or a custom interval. Each image keeps its own saved size and position.",
  },
  {
    question: "How can I add images to Arras?",
    answer:
      "You can paste a copied image with Command-V, drag files onto the menu bar icon, import up to 20 images from the Photos library, or capture a selected area of the screen and pin it to the desktop.",
  },
  {
    question: "Does Arras support animated GIFs and photo styling?",
    answer:
      "Yes. GIFs can animate without keeping the main app busy, and photos can use Gallery, Polaroid, Minimal, or Modern presets. You can also adjust shape masks, mats, shadows, borders, vignettes, and tilt.",
  },
  {
    question: "How much memory and CPU does Arras use?",
    answer:
      "The current Arras build is designed to sit at roughly 20 MB of memory with effectively zero idle CPU. The download is about 2.4 MB, making it a lightweight alternative to heavier desktop customization tools.",
  },
  {
    question: "Which Macs can run Arras?",
    answer:
      "Arras requires macOS 14 or later and the current release is built for Apple Silicon Macs. Intel Macs are not supported by the current download.",
  },
  {
    question: "Is Arras free and open source?",
    answer:
      "Yes. Arras is free with no subscription, account, or telemetry, and its source is available on GitHub under the MIT License. You can install it from the DMG or through the Homebrew tap listed on the page.",
  },
];

export const fadeoFaqs = [
  {
    question: "What is Fadeo for macOS?",
    answer:
      "Fadeo is a native workflow audio app for macOS. It automatically plays, fades, pauses, or switches audio according to context such as the frontmost app, current desktop Space, meeting activity, Focus mode, or a schedule you define.",
  },
  {
    question: "How does Fadeo decide which audio workspace should play?",
    answer:
      "Fadeo evaluates four ordered bands: matching override workspaces, regular candidates, a configurable tiebreak chain, and a fallback when nothing matches. This deterministic precedence system makes automatic audio behavior predictable and editable.",
  },
  {
    question: "What rules can a Fadeo workspace use?",
    answer:
      "A workspace can match applications, macOS Spaces, meetings, Focus modes, and time windows. Apps can also be marked as weak matches, meaning they can keep a workspace active without pulling you into it on their own.",
  },
  {
    question: "Does Fadeo work with Spotify and Apple Music?",
    answer:
      "Yes. Fadeo can control Spotify and Apple Music, including specific playlists, as part of its automatic workspace rules. It can also use locally synthesized ambient sounds when you do not want music.",
  },
  {
    question: "Does Fadeo include ambient noise?",
    answer:
      "Yes. Fadeo synthesizes ambient noise on your Mac in real time instead of shipping large looping audio files. This avoids obvious loop seams and keeps the sound library compact.",
  },
  {
    question: "Will Fadeo change my Mac's system volume?",
    answer:
      "No. Fadeo leaves the macOS system volume untouched. It manages playback and its own fade behavior, so your global output-volume setting remains under your control.",
  },
  {
    question: "Does Fadeo constantly poll my Mac in the background?",
    answer:
      "No. Fadeo uses operating-system events rather than continuous polling and is designed for effectively zero idle CPU use. Context matching and audio decisions happen locally on the Mac.",
  },
  {
    question: "Is Fadeo free, or do I need a license?",
    answer:
      "Fadeo remains fully functional without a license. An optional pay-what-you-want lifetime license, currently with a $2 minimum, removes a small occasional reminder. It is a one-time purchase, not a subscription.",
  },
  {
    question: "Is Fadeo open source?",
    answer:
      "Yes. Fadeo's source code is available on GitHub under GPLv3. You can inspect it, fork it, or build the app yourself for free, whether or not you buy a lifetime license.",
  },
  {
    question: "What data does Fadeo send from my Mac?",
    answer:
      "Workflow context and rules stay on your Mac, and Fadeo does not record camera footage, microphone audio, calls, or application content. Limited data is sent only for features you use, such as license activation, an optional diagnostic report, feedback, a free-license email, or the mailing list.",
  },
];
