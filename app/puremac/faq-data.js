const SOURCES = {
  appleWidgets: {
    label: "Apple Support: Add and customize widgets on Mac",
    href: "https://support.apple.com/guide/mac-help/mchl52be5da5/mac",
  },
  appleGatekeeper: {
    label: "Apple Support: Safely open apps on your Mac",
    href: "https://support.apple.com/102445",
  },
  appleFocus: {
    label: "Apple Support: Set up a Focus on Mac",
    href: "https://support.apple.com/guide/mac-help/mchl613dc43f/mac",
  },
  appleMusic: {
    label: "Apple Support: Change Playback settings in Music on Mac",
    href: "https://support.apple.com/guide/music/musdf855a1b/mac",
  },
  appleActivity: {
    label: "Apple Support: Activity Monitor User Guide",
    href: "https://support.apple.com/guide/activity-monitor/welcome/mac",
  },
  githubLicensing: {
    label: "GitHub Docs: Licensing a repository",
    href: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository",
  },
  arrasRepo: {
    label: "Arras source and technical documentation",
    href: "https://github.com/yashashwi-s/Arras",
  },
  fadeoRepo: {
    label: "Fadeo source and architecture documentation",
    href: "https://github.com/yashashwi-s/Fadeo",
  },
};

export const pureMacFaqs = [
  {
    question: "What is PureMac?",
    answer:
      "PureMac is a small collection of native macOS apps by Yashashwi Singhania. Each app focuses on one job, uses native Mac technologies instead of Electron, and is published with source code you can inspect or build yourself.",
    sources: [SOURCES.arrasRepo, SOURCES.fadeoRepo],
  },
  {
    question: "Which Mac apps are available from PureMac?",
    answer:
      "PureMac currently includes Arras, a desktop photo widget app that preserves each image's aspect ratio, and Fadeo, a workflow audio app that automatically changes sound to match the app, Space, meeting, Focus mode, or schedule you are using.",
    sources: [SOURCES.arrasRepo, SOURCES.fadeoRepo],
  },
  {
    question: "Are PureMac apps free to use?",
    answer:
      "Yes. Arras is free forever, and Fadeo remains fully functional without a license. Fadeo also offers an optional pay-what-you-want lifetime license that removes an occasional reminder.",
    sources: [SOURCES.arrasRepo, SOURCES.fadeoRepo],
  },
  {
    question: "Are PureMac apps open source?",
    answer:
      "Yes. Arras is released under the MIT License and Fadeo under GPLv3. Their source code and release history are available on GitHub, so you can audit the code, report issues, fork a project, or build the apps yourself.",
    sources: [SOURCES.githubLicensing, SOURCES.arrasRepo, SOURCES.fadeoRepo],
  },
  {
    question: "Do PureMac apps use Electron?",
    answer:
      "No. PureMac apps are native macOS software rather than web apps wrapped in Electron. That keeps them small, responsive, and closely integrated with Mac features such as desktop windows, Spaces, Focus modes, and media controls.",
    sources: [SOURCES.arrasRepo, SOURCES.fadeoRepo],
  },
  {
    question: "Do PureMac apps collect telemetry?",
    answer:
      "PureMac does not build its apps around background tracking. Arras sends nothing home. Fadeo makes its workflow decisions locally and only sends limited information for actions such as license activation, optional diagnostics, feedback, or a mailing-list signup.",
    sources: [SOURCES.arrasRepo, SOURCES.fadeoRepo],
  },
  {
    question: "What version of macOS do PureMac apps require?",
    answer:
      "The current Arras and Fadeo releases require macOS 14 or later. Arras currently requires Apple Silicon; check each product page and GitHub release before downloading because compatibility can change between versions.",
    sources: [SOURCES.arrasRepo, SOURCES.fadeoRepo],
  },
  {
    question: "How do I install a PureMac app?",
    answer:
      "Download the latest DMG from the app's PureMac page or GitHub release. Arras can also be installed through Yashashwi's Homebrew tap. The product page lists the exact installation steps and any one-time Gatekeeper action.",
    sources: [SOURCES.arrasRepo, SOURCES.fadeoRepo, SOURCES.appleGatekeeper],
  },
  {
    question: "Why can macOS show a Gatekeeper warning for a PureMac download?",
    answer:
      "The apps are ad-hoc signed and distributed outside the Mac App Store. macOS may therefore ask you to approve the app once in Privacy & Security. The warning reflects the distribution method, and you can inspect the public source before deciding to run it.",
    sources: [SOURCES.appleGatekeeper, SOURCES.arrasRepo, SOURCES.fadeoRepo],
  },
  {
    question: "Are PureMac apps subscription based?",
    answer:
      "No. Arras has no charge, and Fadeo's optional license is a one-time lifetime purchase rather than a recurring subscription. Both apps can be downloaded and run without creating an account.",
    sources: [SOURCES.arrasRepo, SOURCES.fadeoRepo],
  },
];

export const arrasFaqs = [
  {
    question: "Does Mac have desktop widgets?",
    answer: [
      "Yes. Apple supports widgets on the Mac desktop and in Notification Center. Apple’s own instructions say to Control-click the wallpaper, choose Edit Widgets, then click or drag a widget onto the desktop.",
      "Arras uses independent borderless desktop windows instead of Apple’s fixed WidgetKit frames. That is what lets a panorama remain panoramic and a portrait remain vertical rather than forcing every photo into one of the system widget sizes.",
    ],
    sources: [SOURCES.appleWidgets, SOURCES.arrasRepo],
  },
  {
    question: "How to add photo widgets to MacBook desktop?",
    answer: [
      "For Apple’s built-in widgets, Control-click the desktop wallpaper, choose Edit Widgets, search for Photos, and drag the size you want onto the desktop. Apple also documents that widgets can be moved later by dragging them to a new position.",
      "With Arras, install the app and add a photo from its menu bar icon, paste a copied image with Command-V, drag image files onto the menu bar icon, or import from Photos. Arras creates a separate photo window at the image’s true aspect ratio instead of asking you to select a fixed widget size.",
    ],
    sources: [SOURCES.appleWidgets, SOURCES.arrasRepo],
  },
  {
    question: "How to put a specific photo on a widget on a Mac?",
    answer: [
      "Apple’s Photos widget may offer album or memory choices when its Edit option is available, but Apple notes that not every widget exposes editable content. The available choices therefore depend on the widget and macOS version.",
      "Arras gives you direct control over the image: paste the exact photo, drag its file in, choose it from Photos, or add it to a rotating set. Each selected image keeps its own dimensions and saved position.",
    ],
    sources: [SOURCES.appleWidgets, SOURCES.arrasRepo],
  },
  {
    question: "How do I get the photo widget off my Mac desktop?",
    answer: [
      "For a standard macOS widget, Control-click it and choose Remove Widget. Apple also lets you enter Edit Widgets mode and click the widget’s Remove button.",
      "For an Arras photo, right-click the photo window and choose Remove. The same context menu contains its lock and layering controls, so removing one image does not require resetting the rest of the desktop layout.",
    ],
    sources: [SOURCES.appleWidgets, SOURCES.arrasRepo],
  },
  {
    question: "Can Arras rotate several photos in one widget?",
    answer:
      "Yes. Select multiple images to create a rotating desktop photo widget that crossfades on click or on a timed interval, including every 30 seconds, hourly, or a custom interval. Each image keeps its own saved size and position.",
    sources: [SOURCES.arrasRepo],
  },
  {
    question: "How can I add images to Arras?",
    answer:
      "You can paste a copied image with Command-V, drag files onto the menu bar icon, import up to 20 images from the Photos library, or capture a selected area of the screen and pin it to the desktop.",
    sources: [SOURCES.arrasRepo],
  },
  {
    question: "Does Arras support animated GIFs and photo styling?",
    answer:
      "Yes. GIFs can animate without keeping the main app busy, and photos can use Gallery, Polaroid, Minimal, or Modern presets. You can also adjust shape masks, mats, shadows, borders, vignettes, and tilt.",
    sources: [SOURCES.arrasRepo],
  },
  {
    question: "How much memory and CPU does Arras use?",
    answer:
      "The current Arras build is designed to sit at roughly 20 MB of memory with effectively zero idle CPU. The download is about 2.4 MB, making it a lightweight alternative to heavier desktop customization tools.",
    sources: [SOURCES.arrasRepo, SOURCES.appleActivity],
  },
  {
    question: "Which Macs can run Arras?",
    answer:
      "Arras requires macOS 14 or later and the current release is built for Apple Silicon Macs. Intel Macs are not supported by the current download.",
    sources: [SOURCES.arrasRepo],
  },
  {
    question: "Is Arras free and open source?",
    answer:
      "Yes. Arras is free with no subscription, account, or telemetry, and its source is available on GitHub under the MIT License. You can install it from the DMG or through the Homebrew tap listed on the page.",
    sources: [SOURCES.arrasRepo, SOURCES.githubLicensing],
  },
];

export const fadeoFaqs = [
  {
    question: "What is Fadeo for macOS?",
    answer:
      "Fadeo is a native workflow audio app for macOS. It automatically plays, fades, pauses, or switches audio according to context such as the frontmost app, current desktop Space, meeting activity, Focus mode, or a schedule you define.",
    sources: [SOURCES.fadeoRepo],
  },
  {
    question: "How does Fadeo decide which audio workspace should play?",
    answer:
      "Fadeo evaluates four ordered bands: matching override workspaces, regular candidates, a configurable tiebreak chain, and a fallback when nothing matches. This deterministic precedence system makes automatic audio behavior predictable and editable.",
    sources: [SOURCES.fadeoRepo],
  },
  {
    question: "How to automatically turn on focus mode?",
    answer: [
      "macOS can automatically enable a Focus at a chosen time, at a location, or while a particular app is open. Apple documents those automations under System Settings, Focus, Set a Schedule.",
      "Fadeo does not need to control Focus itself. It can use the Focus mode that macOS reports as one rule inside an audio workspace, then combine that signal with the active app, desktop Space, meeting state, or time window.",
    ],
    sources: [SOURCES.appleFocus, SOURCES.fadeoRepo],
  },
  {
    question: "How to make Apple Music switch songs automatically?",
    answer: [
      "Apple Music’s AutoMix and Crossfade settings control how one song transitions into the next. Apple says AutoMix analyzes characteristics such as key and tempo, while Crossfade uses a fixed number of seconds.",
      "Fadeo solves a different automation problem: it can switch the playlist or audio workspace when your Mac context changes. A meeting can pause playback, a coding workspace can start one playlist, and a different Space or app can select another.",
    ],
    sources: [SOURCES.appleMusic, SOURCES.fadeoRepo],
  },
  {
    question: "How to make Apple Music not transition automatically?",
    answer: [
      "In Apple Music on Mac, open Music, Settings, Playback, then turn Song Transitions off. Apple documents AutoMix, Crossfade, and the option to use no transition between songs.",
      "That setting is separate from Fadeo. Fadeo’s fade timing applies when its rules start, stop, or change an audio workspace; it does not require Apple Music’s between-song transitions to be enabled.",
    ],
    sources: [SOURCES.appleMusic, SOURCES.fadeoRepo],
  },
  {
    question: "How do I turn off automatic focus mode on my Mac?",
    answer: [
      "Open System Settings, choose Focus, select the Focus that turns on automatically, and disable or remove its schedule. Apple separates time-, location-, and app-based schedules, so check each automation attached to that Focus.",
      "If Focus should remain automatic but should no longer affect sound, leave the macOS schedule in place and disable the corresponding Focus rule or workspace in Fadeo instead.",
    ],
    sources: [SOURCES.appleFocus, SOURCES.fadeoRepo],
  },
  {
    question: "Does Fadeo constantly poll my Mac in the background?",
    answer:
      "No. Fadeo uses operating-system events rather than continuous polling and is designed for effectively zero idle CPU use. Context matching and audio decisions happen locally on the Mac.",
    sources: [SOURCES.fadeoRepo, SOURCES.appleActivity],
  },
  {
    question: "Is Fadeo free, or do I need a license?",
    answer:
      "Fadeo remains fully functional without a license. An optional pay-what-you-want lifetime license, currently with a $2 minimum, removes a small occasional reminder. It is a one-time purchase, not a subscription.",
    sources: [SOURCES.fadeoRepo],
  },
  {
    question: "Is Fadeo open source?",
    answer:
      "Yes. Fadeo's source code is available on GitHub under GPLv3. You can inspect it, fork it, or build the app yourself for free, whether or not you buy a lifetime license.",
    sources: [SOURCES.fadeoRepo, SOURCES.githubLicensing],
  },
  {
    question: "What data does Fadeo send from my Mac?",
    answer:
      "Workflow context and rules stay on your Mac, and Fadeo does not record camera footage, microphone audio, calls, or application content. Limited data is sent only for features you use, such as license activation, an optional diagnostic report, feedback, a free-license email, or the mailing list.",
    sources: [SOURCES.fadeoRepo],
  },
];
