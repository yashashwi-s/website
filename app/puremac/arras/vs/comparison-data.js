const photosGuide = "guides/photo-on-mac-desktop-without-cropping";
const collageGuide = "guides/mac-desktop-collage";
const referenceGuide = "guides/reference-images-on-mac-desktop";
const arrasSource = ["Arras feature documentation", "https://github.com/yashashwi-s/Arras/blob/main/FEATURES.md"];

export const comparisonDate = "2026-11-13";

export const comparisons = {
  "apple-photos-widget": {
    name: "Apple Photos widget",
    title: "Arras vs Apple’s Photos widget on Mac",
    description: "Use Apple’s built-in widget for a Photos album in the widget gallery. Use Arras to place a specific picture at its natural proportions or keep it visible over your work.",
    image: "appearance",
    imageAlt: "Arras photo widgets with different shapes and frames on a Mac desktop",
    caption: "A real Arras desktop with several independently placed photo widgets.",
    rows: [
      ["Choose the image", "Import the exact photo or start a slideshow with a Photos album.", "Choose a Photos album from the widget’s settings."],
      ["Size and shape", "Resize an individual widget and keep its original proportions in Dynamic mode.", "Choose one of the sizes offered by the widget gallery."],
      ["Placement", "Arrange independent windows on the desktop or float a reference above apps.", "Add the widget to the desktop or Notification Center."],
    ],
    sections: [
      ["One photograph, the way you framed it", "A portrait of a person and a wide photograph of a room ask for different amounts of space. In Arras, add each directly from Finder or Photos and give each a frame that follows the image. If you want the portrait near your files and the room photo next to an open app, set the second widget to Floating."],
      ["When the built-in widget is enough", "If you already keep your favorites in an Apple Photos album and want them among your Calendar and Weather widgets, start with the Photos widget. It is included with macOS and uses the same widget gallery and editing controls as other system widgets."],
      ["A two-photo setup to try", "Start with a tall photo and a panorama. In Arras, choose Add Photos or Videos, then drag and resize each image. Leave them on the desktop or set one to Floating. For a rotating slideshow, keep Dynamic sizing to preserve each image’s proportions or choose Fixed to fill a consistent frame."],
    ],
    guide: [photosGuide, "Put a photo on your Mac desktop without cropping"],
    sources: [["Apple’s guide to desktop widgets", "https://support.apple.com/en-us/guide/mac-help/mchl52be5da5/mac"], ["Apple’s description of the Photos album widget", "https://images.apple.com/mideast/macos/sonoma/pdf/en/macOS_All_New_Features_om.pdf"], arrasSource],
  },
  "smart-photo-widget": {
    name: "Smart Photo Widget",
    title: "Arras vs Smart Photo Widget for Mac",
    description: "Smart Photo Widget automatically frames and rotates a collection. Arras gives you control of each photo widget’s shape, placement and layer.",
    image: "slideshow-layers",
    imageAlt: "An Arras slideshow beside a separate floating photo reference on a Mac desktop",
    caption: "In Arras, a slideshow and a separate reference can share the same desktop.",
    rows: [
      ["Select and frame", "Choose an exact file and preserve its proportions with Dynamic sizing.", "Automatically frames photos for the selected widget size."],
      ["Build a rotation", "Link Finder folders or Photos albums, choose timing and reorder images.", "Automatically rotates a collection and offers options for skipping unwanted photos."],
      ["Add visual context", "Style the frame, group pictures in an editable collage and add captions.", "Offers picture frames and optional date, time and photo information overlays."],
    ],
    sections: [
      ["When an album should do the work", "Cromulent Labs built Smart Photo Widget around a convenient routine. Pick a collection, let it frame and rotate your photos, and use filters to skip photos such as screenshots or blurry images. Its Mac, iPhone and iPad availability can matter if you want a similar widget across devices."],
      ["When each photo should stay in its own shape", "Choose Arras for an uncropped panorama, a portrait in a particular corner or a slideshow you want to compose by hand. Keep one picture fixed while another rotates. The two windows can have separate shapes and layers, so your slideshow can sit on the desktop while your reference stays above a working window."],
      ["A setup for albums and individual photos", "Start with a linked Finder folder or Photos album for the changing widget. Set the sizing to Dynamic, then add a standalone photo for the image you always want to see. If you prefer the desktop to stay visually still, choose on-click advancement."],
    ],
    guide: [photosGuide, "Set up uncropped photo widgets"],
    sources: [["Cromulent Labs feature list", "https://www.cromulent-labs.com/smart-photo-widget/"], ["Smart Photo Widget on the App Store", "https://apps.apple.com/us/app/smart-photo-widget/id1551076448?platform=mac"], arrasSource],
  },
  "widgetwall": {
    name: "WidgetWall",
    title: "Arras vs WidgetWall for Mac desktop widgets",
    description: "WidgetWall is a broad desktop widget suite. Arras is built around uncropped photos, editable photo collages and carefully placed visual references.",
    image: "collages",
    imageAlt: "Two editable Arras collages with independent frames and captions on a Mac desktop",
    caption: "Arras keeps the individual photos editable inside each collage.",
    rows: [
      ["Desktop focus", "Photos, slideshows, visual references and desktop collages.", "Photos alongside tools including clocks, timers, notes and calendars."],
      ["Image arrangement", "Move and resize each picture in a collage, then move the whole group by its background.", "Offers a Photos widget alongside Video and customizable desktop stickers."],
      ["How to get it", "Free MIT-licensed download or a one-time Mac App Store purchase.", "Free to start with additional widgets available through in-app purchases."],
    ],
    sections: [
      ["Start with the kind of desktop you want", "If you want a desktop dashboard with a clock, timers, notes and a few pictures, WidgetWall covers more of that checklist in one place. If the pictures are the composition, Arras gives them the most room to work. Set each image’s size and look, keep its proportions, and decide which pictures should move together."],
      ["What an editable collage changes", "A desktop collage in Arras is a group of individually editable photos. Drag the background to move the group out of the way, then resize a single member when you need to see it more clearly. Add a caption to the collage or place text beside an image, and save the arrangement as a Setup."],
      ["A useful way to try Arras", "Add three images of different proportions and group them into one collage. Try a paper background for a photo wall, or a transparent background to let the wallpaper show through. Keep a separate slideshow outside the group so it can rotate independently."],
    ],
    guide: [collageGuide, "Make an editable Mac desktop collage"],
    sources: [["WidgetWall by Amico Apps", "https://amicoapps.com/app/widgetwall/"], ["WidgetWall features and purchase options", "https://apps.apple.com/us/app/widgetwall/id1618466427?mt=12"], arrasSource],
  },
  "pureref": {
    name: "PureRef",
    title: "Arras vs PureRef for floating reference images",
    description: "Use Arras for a few pinned references and photos that stay part of your Mac desktop. Use PureRef for a dedicated reference board you can navigate and take across platforms.",
    image: "slideshow-layers",
    imageAlt: "Arras showing a desktop slideshow and a separate reference set to Floating",
    caption: "The Floating reference is independent from the slideshow on the desktop.",
    rows: [
      ["Working surface", "Use independent desktop widgets or group related references in an editable collage.", "Collect, organize and navigate references on a dedicated canvas."],
      ["Above your work", "Set a widget or collage to Floating while other photos remain on the desktop.", "Offers Always on Top and a documented free-floating mode."],
      ["Platforms", "Mac, with a free direct edition and an optional Mac App Store edition.", "Mac, Windows and Linux."],
    ],
    sections: [
      ["Keep a few references within reach", "A palette, a sketch and a crop of your current brief often work best as small windows next to the work itself. In Arras, set each to Floating, give it a note or source link, and keep it where you want it. The rest of your desktop can keep its photos or slideshows at another layer."],
      ["When a dedicated board fits better", "PureRef is a natural fit when you want a large collection of references that you can pan and zoom through, organize on one canvas, or open on another operating system. Its handbook also documents floating windows and opacity, so both apps can keep a reference visible while you work."],
      ["Try an everyday reference setup", "Add two images in Arras. Leave the first on the desktop and set the second to Floating. Enable the Screenshot or PDF command in Preferences if your reference is a region or page. Use Reference Tools for a crop, flip or note, then save the layout if you want it again tomorrow."],
    ],
    guide: [referenceGuide, "Pin floating reference images on your Mac"],
    sources: [["PureRef product overview", "https://www.pureref.com/"], ["PureRef handbook", "https://www.pureref.com/handbook/features/"], arrasSource],
  },
  "photo-widget-sindre-sorhus": {
    name: "Photo Widget by Sindre Sorhus",
    title: "Arras vs Photo Widget by Sindre Sorhus",
    description: "Photo Widget offers single pictures and slideshows through Apple’s widget gallery. Arras offers freely sized desktop photos, floating references and editable collages.",
    image: "appearance",
    imageAlt: "Custom Arras photo widgets in round, arch and rectangle frames",
    caption: "Independently placed Arras widgets can have different shapes and sizes.",
    rows: [
      ["Photo source", "Add a single photo, a Finder folder or a Photos album.", "Create a widget for a single picture, a slideshow or a Photos album."],
      ["Layout", "Size and place photos independently, then group them if they should move together.", "Add photo widgets through the system’s widget gallery."],
      ["Platforms", "Runs on Apple Silicon and Intel Macs with macOS 14 or later.", "Available on macOS, iOS and visionOS. The Mac app requires Apple Silicon."],
    ],
    sections: [
      ["Which kind of photo widget fits your desktop?", "Photo Widget is a good fit if you want a picture among the widgets you already use or if you want the same app on your iPhone. For a desktop with a tall portrait beside a wide photograph, Arras gives each picture its own dimensions and position."],
      ["How to arrange photos as a group", "In Arras, add the photos you want to keep together and drag one onto the other to start a collage. Place a caption near the picture it describes. Move the collage by its background, then adjust one member if the layout needs a little more space."],
      ["If your desktop is usually covered by other apps", "Start with a single photo and choose the Floating layer. This keeps the image available above your work and lets you retain another photo in the desktop layer. If you just want an album visible when you reveal the desktop, either app can make sense."],
    ],
    guide: [collageGuide, "Make an editable Mac desktop collage"],
    sources: [["Photo Widget by Sindre Sorhus", "https://sindresorhus.com/photo-widget"], arrasSource],
  },
  "photowidget-vatsal": {
    name: "PhotoWidget by Vatsal Vaghasiya",
    title: "Arras vs the open-source PhotoWidget for Mac",
    description: "Both projects put your own photos on a Mac desktop. PhotoWidget uses Apple’s widget gallery with Fill and Fit options. Arras gives photos independently sized windows and optional floating placement.",
    image: "slideshow-layers",
    imageAlt: "An uncropped Arras slideshow and a standalone floating photo",
    caption: "A portrait slideshow stays tall while a separate Arras widget floats above apps.",
    rows: [
      ["Show an exact photo", "Import a file directly, or choose a specific photo from your library.", "Choose a particular image or shuffle an album from the widget’s settings."],
      ["Fit the picture", "The window follows the picture’s proportions in Dynamic sizing.", "Fit preserves the picture within a fixed widget; Fill makes the image cover it."],
      ["Desktop integration", "Arrange independent panels, choose their depth and save named setups.", "Add macOS widgets in four standard sizes through Edit Widgets."],
    ],
    sections: [
      ["When WidgetKit is a good fit", "Vatsal Vaghasiya’s PhotoWidget is a good option when a photo should live in the same system widget grid as Weather or Calendar. You can select an exact picture, choose how it scales, and create a separate widget that shuffles a collection."],
      ["When the widget should follow the image", "A tall portrait may look best with a tall window, and a panorama may need a much wider one. Arras uses independent windows so those two pieces can be resized and arranged by hand. Set one to Floating if it should stay next to an app while the other remains on the desktop."],
      ["Choose the license and installation you prefer", "Both projects have MIT-licensed source. Arras offers a signed and notarized direct download as well as an optional Mac App Store edition. See each project’s installation instructions for how to install and update the release you choose."],
    ],
    guide: [photosGuide, "Set up uncropped photo widgets"],
    sources: [["PhotoWidget source and documented features", "https://github.com/Vatsal057/PhotoWidget"], ["Arras installation guide", "https://tryarras.tech/#install"], arrasSource],
  },
};
