export const guidePublishedDate = "2026-11-06";

export const guides = {
  "photo-on-mac-desktop-without-cropping": {
    title: "Put a photo on your Mac desktop without cropping",
    description: "Add an uncropped photo widget to your Mac desktop at its true aspect ratio. Keep portraits tall and panoramas wide without changing your wallpaper.",
    updated: "2026-11-25",
    image: "slideshow-layers",
    alt: "A tall portrait photo slideshow and a separate floating photo widget at their natural proportions on a Mac desktop",
    caption: "A portrait slideshow and a separate floating photo at their true aspect ratios on a real Mac desktop.",
    sections: [
      {
        id: "wallpaper-vs-widget",
        title: "Desktop wallpaper vs. desktop photo widget",
        paragraphs: [
          "There are two different ways people try to put a photo on a Mac desktop without cropping. If you want one image to fill your entire screen background, open System Settings → Wallpaper and change Fill Screen to Fit to Screen (which prevents cropping by adding colored bars on the sides). If you want to keep your wallpaper and place one or more uncropped photos on top of it as widgets, Apple’s built-in Photos widget forces every picture into a fixed square or rectangular WidgetKit grid and automatically crops tall portraits and wide panoramas.",
          "Arras solves the desktop widget side of the problem. Every Arras widget is an independent native AppKit window that matches your image’s true aspect ratio, so portraits stay tall, panoramas stay wide, and nothing gets sliced off by a widget grid."
        ]
      },
      {
        id: "add",
        title: "Add the original photo from Finder or Photos",
        paragraphs: [
          "Open Arras from the menu bar and choose Add → Add Photos or Videos, or drag an image file directly onto the Arras menu bar icon. You can also choose Add → Try an Example to start with bundled artwork and swap in your own image later with Photo Tools → Replace Image.",
          "Arras copies imported media into its local library on your Mac, so your desktop widget keeps displaying even if you move or reorganize the original file in Finder."
        ]
      },
      {
        id: "fit",
        title: "Resize at the photo’s natural proportions",
        paragraphs: [
          "Drag anywhere on the photo to move it across your desktop. Hover a corner and drag to resize smoothly while locking its original aspect ratio. Hold Shift while dragging to constrain movement to one axis, or hold Command to temporarily disable edge snapping.",
          "Choose the Plain or Thin Frame look in Appearance when you want the uncropped image to stay front and center. Masks (circle, squircle, arch) and Reference Tools crops are completely optional. For multi-photo slideshows, keep Dynamic sizing enabled so each picture keeps its own natural proportions instead of cropping to a Fixed box."
        ]
      },
      {
        id: "place",
        title: "Pin the photo to your desktop or float it above apps",
        paragraphs: [
          "In Arras Settings, choose a depth layer for each widget: Behind Icons, On Desktop, Above Widgets, or Floating. Set Depth to On Desktop to keep the photo beside your files, or use Lock Position so stray clicks never nudge it out of place. Save your layout as a named Setup before experimenting with a new arrangement."
        ]
      }
    ]
  },
  "mac-desktop-collage": {
    title: "Make an editable photo collage on your Mac desktop",
    description: "Build a live Mac desktop photo collage with independent photos, glass or paper frames, captions, and alignment guides, without flattening the layout.",
    updated: "2026-11-25",
    image: "collages",
    alt: "A paper collage and a transparent collage with individually framed photos and editable captions on a real Mac desktop",
    caption: "Paper and transparent editable collages captured on a real Mac desktop with sample photos.",
    sections: [
      {
        id: "create",
        title: "Build a group you can keep editing",
        paragraphs: [
          "Most collage makers export a single flattened JPEG, which means changing one photo or adjusting spacing forces you to rebuild the whole image. In Arras, choose Add → Create Collage in Settings (or drag one desktop photo onto another) to build a live collage directly on your Mac desktop.",
          "Pick System Glass, White Polaroid, Gallery, Ink, or Transparent as your collage style. Drag the collage background to move the entire group together, or drag any individual photo inside it to reposition, resize, or detach it."
        ]
      },
      {
        id: "arrange",
        title: "Align, style, and label each member",
        paragraphs: [
          "Hover a photo’s corner to resize it; the collage backdrop automatically grows and shrinks to fit while nearby alignment guides keep edges crisp. Select multiple rows in Settings to align, distribute, or nudge photos cleanly.",
          "Use Copy Appearance to apply a frame, mat, shadow, or tilt from one photo to another without overwriting its image or placement. Add a collage caption or place free-standing text labels with custom fonts. Depth and Space pinning belong to the collage group, while detached members keep their own standalone values."
        ]
      },
      {
        id: "save",
        title: "Save setups and portable .arras backups",
        paragraphs: [
          "Save your finished collage as a named Setup in Settings → Saved Setups so you can switch between work, creative, and personal desktops anytime. Session Undo/Redo covers movement, resizing, and membership edits, and Export Backup writes a portable .arras archive with your layout and stored media."
        ]
      }
    ]
  },
  "reference-images-on-mac-desktop": {
    title: "Pin a floating reference image above windows on Mac",
    description: "Float a photo, screenshot, or PDF page above your Mac apps with Arras. Keep visual references visible while designing, coding, or writing.",
    updated: "2026-11-25",
    image: "appearance",
    alt: "Independently shaped photo references and transparent collages on a real Mac desktop",
    caption: "Independent photo widgets and transparent collages on a Mac desktop; any widget or collage can be set to Floating depth.",
    sections: [
      {
        id: "float",
        title: "Float a photo above your open apps",
        paragraphs: [
          "Add any image in Arras, then click the Arras menu bar icon → Widgets → select your photo → Float Above Windows (or set Depth to Floating in Settings). Because Arras widgets are non-activating AppKit windows, scrolling to adjust opacity or viewing a floating reference never steals keyboard focus from your editor or design app.",
          "Resize from any corner and lock its position once placed. For multiple references, such as a color palette, typography sample, and layout screenshot, group them into a collage and set the collage’s depth to Floating. Choose Pin to this Space if you only want the reference on your current desktop Space."
        ]
      },
      {
        id: "context",
        title: "Non-destructive Reference Tools, screenshots, and PDFs",
        paragraphs: [
          "Open Tools → Reference Tools to apply non-destructive crop, quarter-turn rotation, horizontal/vertical flips, or grayscale (handy for checking tonal values), plus attach notes and a source link without modifying the stored original.",
          "In Preferences → Menu bar, enable Paste as Widget, Capture Screen Region, and Add PDF Page to turn clipboard images, screen snips, or a PDF diagram directly into a floating reference. Screen-region capture uses macOS Screen Recording permission; ordinary local photo widgets need neither Accessibility nor Full Disk Access."
        ]
      },
      {
        id: "reuse",
        title: "Privacy and reusable project setups",
        paragraphs: [
          "Save each project’s references as a named Setup so you can swap workspaces in one click, or toggle all widgets instantly with your global keyboard shortcut. Before sharing your screen in a call or recording, hide private widgets manually (screen-capture exclusion is a compatibility request and modern recorders may still include visible windows)."
        ]
      }
    ]
  },
  "fix-mac-desktop-photo-widget-black-and-white": {
    title: "Fix Mac desktop photo widget turning black and white",
    description: "Stop macOS Sonoma, Sequoia, and newer from turning desktop photo widgets monochrome or faded when you click into an app window.",
    updated: "2026-11-25",
    image: "appearance",
    alt: "Full-color Mac desktop photo widgets with Arras staying vivid beside open app windows",
    caption: "Arras photo widgets render in full color regardless of macOS’s dimmed desktop widget tinting.",
    sections: [
      {
        id: "why-monochrome",
        title: "Why macOS turns desktop photo widgets black and white",
        paragraphs: [
          "Starting in macOS Sonoma, Apple’s desktop widget style defaults to Automatic. Whenever you focus an application window instead of the desktop, macOS fades native WidgetKit widgets into a tinted monochrome look so they blend into the wallpaper. That works fine for a clock or calendar, but it washes out family photos, artwork, and moodboards.",
          "You can fix this either in macOS System Settings for Apple’s built-in Photos widget, or by using a native AppKit photo widget like Arras that always renders photos in full color."
        ]
      },
      {
        id: "system-settings-fix",
        title: "Method 1: Force full color in macOS System Settings",
        paragraphs: [
          "Open System Settings → Desktop & Dock and scroll to the Widgets section. Change Widget style from Automatic (or Monochrome) to Full-color. Your Apple Photos widget will stop desaturating when other apps are in front.",
          "Keep in mind this changes every desktop widget at once (including Calendar, Weather, and Reminders) and still keeps Apple’s fixed square/rectangular cropping."
        ]
      },
      {
        id: "arras-full-color",
        title: "Method 2: Keep photos full color while other widgets stay monochrome",
        paragraphs: [
          "If you like monochrome system widgets for clocks and weather but want your photos to stay rich and uncropped, place your photos with Arras instead of WidgetKit. Arras renders independent AppKit photo windows that keep their natural colors and proportions at all times, while offering optional per-widget opacity, hover-reveal, and grayscale in Reference Tools when you actually want a muted look."
        ]
      }
    ]
  },
  "animated-gif-and-video-on-mac-desktop": {
    title: "Put an animated GIF or video on your Mac desktop",
    description: "Pin animated GIFs, APNGs, and muted local videos directly on your Mac desktop alongside still photos using native Core Animation playback.",
    updated: "2026-11-25",
    image: "slideshow-layers",
    alt: "Arras desktop photo and motion widgets arranged cleanly on a macOS wallpaper",
    caption: "Combine still photos, slideshows, animated GIFs/APNGs, and muted local videos on one desktop.",
    sections: [
      {
        id: "why-native-fails",
        title: "Why Apple’s Photos widget cannot play GIFs or videos",
        paragraphs: [
          "macOS WidgetKit widgets are designed for static snapshots refreshed on a timeline, so Apple’s built-in Photos widget does not animate GIFs or loop video clips on your desktop.",
          "Arras renders animated GIF and APNG files directly through Core Animation (without running an app-side per-frame timer loop) and supports muted local video widgets alongside still photos."
        ]
      },
      {
        id: "add-motion",
        title: "Add a GIF, APNG, or local video widget",
        paragraphs: [
          "Open Arras from the menu bar and choose Add → Add Photos or Videos, or drag a local GIF, APNG, or video file onto the menu bar icon. Arras preserves animated bytes on import so your animation plays smoothly at its natural aspect ratio.",
          "You can apply frames, corner radius, opacity, masks, and depth layers (On Desktop, Above Widgets, or Floating) to animated widgets just like still photos, and even include them inside an editable desktop collage."
        ]
      },
      {
        id: "battery-and-motion",
        title: "Playback policies, Reduce Motion, and fullscreen hiding",
        paragraphs: [
          "To keep your Mac quiet when you are focused on full-screen work or video calls, enable automatic fullscreen hiding and conferencing-app hiding in Arras → Privacy. Arras also respects macOS Reduce Motion for interface transitions and slideshow crossfades."
        ]
      }
    ]
  },
  "mac-desktop-slideshow-from-finder-folder": {
    title: "Make a Mac desktop slideshow from a Finder folder",
    description: "Create a rotating Mac desktop photo slideshow linked directly to a local Finder folder or Apple Photos album, with no forced cropping.",
    updated: "2026-11-25",
    image: "slideshow-layers",
    alt: "A Mac desktop slideshow widget rotating photos from a linked collection beside a floating reference",
    caption: "Linked Finder folders and Photos albums rotate on a timer or on click while keeping a managed local snapshot.",
    sections: [
      {
        id: "folder-vs-photos",
        title: "Link a Finder folder without importing into Apple Photos",
        paragraphs: [
          "Apple’s built-in Photos widget only reads from the Apple Photos library. If your photography, design inspiration, or project renders live in a regular Finder folder, you have to duplicate them into Photos first just to show them on your desktop.",
          "In Arras, you can create a Space slideshow directly from a local Finder folder or an Apple Photos album. Arras keeps a managed local snapshot so your slideshow keeps working offline, and refreshes cleanly when you add or update images in the source folder."
        ]
      },
      {
        id: "timing-and-sizing",
        title: "Choose Dynamic proportions, Fixed framing, and cadence",
        paragraphs: [
          "Open the slideshow row in Arras Settings → Edit Slideshow to pick your rotation interval: on double-click, every 30 seconds, every 5 minutes, hourly, daily, or a custom interval. You can also advance or step back from the menu bar or Apple Shortcuts.",
          "Use Dynamic sizing when your folder mixes portraits and landscapes, Arras remembers an independent true-ratio frame for each image. Choose Fixed sizing when you want every slide to fill one consistent frame."
        ]
      }
    ]
  },
  "single-photo-on-mac-desktop-without-album": {
    title: "Put a single photo on your Mac desktop without an album",
    description: "Display one exact picture on your Mac desktop directly from Finder or the clipboard, without creating a single-photo album in Apple Photos.",
    updated: "2026-11-25",
    image: "collages",
    alt: "Individual uncropped desktop photo widgets styled with frames and mats on macOS",
    caption: "Place any single photo directly from Finder, Photos, or your clipboard with zero album workarounds.",
    sections: [
      {
        id: "no-album-workaround",
        title: "Skip the single-photo Apple Photos album workaround",
        paragraphs: [
          "Apple’s built-in macOS Photos widget has no option to pick one individual image file. To show a single picture, you have to import it into Apple Photos, create a dedicated one-photo album, and point the widget to that album, and even then, macOS crops it to a rigid widget rectangle.",
          "With Arras, simply drop any JPEG, PNG, HEIC, TIFF, WebP, or GIF file onto the menu bar icon, paste an image from your clipboard, or pick a photo in Settings → Add. It appears immediately on your desktop at its real proportions."
        ]
      },
      {
        id: "style-and-lock",
        title: "Frame it, place it, and lock it in place",
        paragraphs: [
          "Choose from Thin Frame, Print, Plain, Soft Shadow, Dark Mat, or Warm Paper looks, then fine-tune mat width, border, shadow, opacity, or subtle tilt (−12° to +12°). Right-click the widget to lock its position so it stays anchored on your desktop across restarts and display reconnects."
        ]
      }
    ]
  },
  "pin-transparent-png-screenshot-or-pdf-on-mac-desktop": {
    title: "Pin a transparent PNG, screenshot, or PDF on Mac desktop",
    description: "Place transparent PNG stickers, one-time screen-region captures, or imported PDF pages directly on your Mac desktop or floating above apps.",
    updated: "2026-11-25",
    image: "appearance",
    alt: "Custom shaped and borderless Mac desktop image widgets arranged on macOS",
    caption: "Pin transparent PNGs with alpha preserved, quick screen snips, or reference PDF pages anywhere on your Mac.",
    sections: [
      {
        id: "transparent-png",
        title: "Transparent PNG stickers with full alpha preservation",
        paragraphs: [
          "Arras preserves transparency when importing PNG files, so stickers, logos, illustrations, and cutouts sit directly on your wallpaper without a boxy background. Choose the Plain look with no mat or border to let the cutout float cleanly on your desktop."
        ]
      },
      {
        id: "screenshot-and-pdf",
        title: "Capture a screen region or import a PDF page",
        paragraphs: [
          "Open Arras Settings → Preferences → Menu bar and enable Capture Screen Region, Add PDF Page, and Paste as Widget. Whenever you need to pin a chart, receipt, shortcut cheat sheet, or UI detail, trigger the command from the Arras menu bar → Add.",
          "Set the pinned capture to Floating depth to keep it visible over your browser or editor while you work, and dismiss or recover it anytime from Settings."
        ]
      }
    ]
  },
  "best-mac-desktop-photo-widget-apps": {
    title: "Best Mac desktop photo widget apps compared (2026)",
    description: "An honest comparison of Mac desktop photo widget apps: Apple Photos Widget, Arras, Photo Widget by Sindre Sorhus, Smart Photo Widget, WidgetWall, and PureRef.",
    updated: "2026-11-25",
    image: "collages",
    alt: "Editable Mac desktop photo collages and widgets built with Arras on macOS",
    caption: "Different Mac photo widget tools excel at different setups: native WidgetKit grids, broad utility suites, floating boards, or uncropped desktop collages.",
    sections: [
      {
        id: "quick-pick",
        title: "Which Mac photo widget app fits your setup?",
        paragraphs: [
          "The right Mac photo widget app depends on whether you want a picture inside Apple’s system widget grid, an all-in-one utility dashboard, an infinite artist canvas, or uncropped photos and editable collages directly on your desktop.",
          "Apple’s built-in Photos widget is free and pre-installed for rotating an Apple Photos album inside the WidgetKit grid. Photo Widget by Sindre Sorhus is a clean, lightweight WidgetKit app for single photos and albums across Apple Silicon Mac, iPhone, iPad, and Vision Pro. Smart Photo Widget adds automatic subject framing and filters for photo collections."
        ]
      },
      {
        id: "beyond-grid",
        title: "When you outgrow macOS’s fixed widget grid",
        paragraphs: [
          "WidgetKit widgets share three built-in limits: fixed square/rectangular aspect ratios, desktop-only placement behind app windows, and no animated GIF/video or live multi-photo collages.",
          "WidgetWall is a strong choice if you want a broad desktop suite with clocks, timers, notes, and calendars alongside photos. PureRef is the cross-platform standard for artists who need a dedicated zoomable infinite reference canvas. Arras is built specifically for Mac users who want uncropped photos at their true aspect ratio, editable desktop collages, linked Finder folder slideshows, animated GIFs/videos, and optional floating references, available as a free MIT-licensed direct download or a one-time Mac App Store purchase."
        ]
      },
      {
        id: "next-steps",
        title: "Compare specific apps side by side",
        paragraphs: [
          "For detailed feature tables with primary sources, read our head-to-head comparisons against Apple’s Photos widget, Photo Widget by Sindre Sorhus, Smart Photo Widget, WidgetWall, PureRef, Cozy, PhotoStickies, Color Widgets, ScreenFloat 2, and Apple Freeform."
        ]
      }
    ]
  },
  "how-to-add-photo-widgets-on-macbook": {
    title: "How to add photo widgets on Mac and MacBook (2026)",
    description: "Step-by-step guide to adding photo widgets on a MacBook or Mac desktop, using Apple’s built-in Photos widget or uncropped Arras photo widgets.",
    updated: "2026-11-25",
    image: "collages",
    alt: "Photo widgets and editable collages arranged on a MacBook desktop using Arras",
    caption: "Arras photo widgets and editable collages on a MacBook desktop, preserving each photo’s original proportions.",
    sections: [
      {
        id: "built-in-method",
        title: "Method 1: Add Apple’s built-in Photos widget on MacBook",
        paragraphs: [
          "On macOS Sonoma, Sequoia, or later, right-click (or two-finger tap on your MacBook trackpad) anywhere on the desktop and choose Edit Widgets. Search for Photos, pick Small, Medium, or Large, and drag it onto your desktop.",
          "Right-click the placed widget and choose Edit Widget to select an Apple Photos album. Remember two macOS limits: Apple’s widget crops photos to a fixed rectangle and dims them to monochrome when another app is active unless you change System Settings → Desktop & Dock → Widget style to Full-color."
        ]
      },
      {
        id: "arras-method",
        title: "Method 2: Add uncropped photo widgets from Finder or Photos with Arras",
        paragraphs: [
          "If you want to place a specific image from Finder, keep portraits and panoramas uncropped, build an editable collage, or keep a photo floating above your apps on a MacBook screen, install Arras (free open-source download or Mac App Store).",
          "Click the Arras icon in your menu bar and choose Add → Add Photos or Videos, or drag any JPEG, PNG, HEIC, WebP, or GIF onto the menu bar icon. Drag to position, resize from any corner at the image’s true aspect ratio, and choose a frame or depth layer in Settings."
        ]
      },
      {
        id: "macbook-tips",
        title: "Best settings for MacBook displays and external monitors",
        paragraphs: [
          "Arras remembers each widget’s exact frame per display. When you unplug your MacBook from an external monitor, widgets placed on that monitor hide cleanly and return to their saved positions when you reconnect. Enable automatic fullscreen hiding in Arras → Privacy to release image memory while watching videos or working in full-screen apps."
        ]
      }
    ]
  },
  "polaroid-photo-widget-mac-desktop": {
    title: "How to add Polaroid photo widgets to your Mac desktop",
    description: "Style Mac desktop photos with instant-photo Polaroid frames, handwritten-style captions, subtle tilt, and editable photo walls using Arras.",
    updated: "2026-11-25",
    image: "appearance",
    alt: "Polaroid and Gallery framed photo widgets with captions arranged on a Mac desktop",
    caption: "Polaroid and instant-photo frames with custom mats, captions, and subtle tilt on a real Mac desktop.",
    sections: [
      {
        id: "polaroid-look",
        title: "Give any photo an instant-photo Polaroid frame",
        paragraphs: [
          "Add your photo in Arras, then open its Appearance controls in Settings. Select the Print or Warm Paper look (or start with White Polaroid inside an editable collage) to add a crisp paper mat and soft two-layer shadow around your picture.",
          "Fine-tune the mat width, corner radius, border stroke, and tilt angle from −12° to +12° so a cluster of desktop photos feels like real prints pinned beside your workspace."
        ]
      },
      {
        id: "captions-and-wall",
        title: "Add captions and group prints into an editable photo wall",
        paragraphs: [
          "Drag one Polaroid photo onto another to form a live collage, then add captions or freely placed text labels with custom fonts. Use Copy Appearance to apply your favorite Polaroid frame style to every photo in one click without replacing their images or placement."
        ]
      }
    ]
  }
};
