export const guidePublishedDate = "2026-11-06";

export const guides = {
  "photo-on-mac-desktop-without-cropping": {
    title: "Pin a photo on your Mac desktop without cropping",
    description: "Add a photo from Finder and pin it to your Mac desktop with Arras. Resize a portrait, landscape or panorama without cropping the picture.",
    updated: "2026-11-15",
    image: "slideshow-layers", alt: "A tall photo and a separate floating reference at their natural proportions on a real Mac desktop",
    caption: "A portrait slideshow and a separate floating photo. Existing Arras desktop capture with sample images.",
    sections: [
      { id: "add", title: "Start with the original picture", paragraphs: ["Open Arras from the menu bar and choose Add → Add Photos or Videos. Select a local photo, or choose Try an Example to start with bundled artwork. Arras copies imported media into its local library, so the widget remains available when the original file is moved."] },
      { id: "fit", title: "Resize at the photo’s original proportions", paragraphs: ["Drag the picture to move it. Hover a corner and drag to resize it while preserving its aspect ratio. A tall portrait stays tall and a wide panorama stays wide. Choose a thin frame or Plain look if you want the edges of the original image to remain the focus.", "Shapes and Reference Tools are optional edits. A circle, arch or a crop you choose can mask part of a picture. For slideshows, Dynamic sizing preserves each picture’s proportions; Fixed sizing fills one frame and can crop. Choose the setting that matches the result you want."] },
      { id: "place", title: "Pin the photo to the desktop", paragraphs: ["In Arras Settings, open the photo’s controls and set Depth to On Desktop. If the photo is floating above your apps, click the Arras icon in the menu bar, open Widgets, find the photo and choose Pin to Desktop. Lock Position keeps it where you put it. Save the arrangement as a named Setup if you want to return to it later."] },
    ],
  },
  "mac-desktop-collage": {
    title: "Make an editable photo collage on your Mac desktop",
    description: "Arrange a live Arras collage with independent photos, captions and alignment guides. Move the group, resize its members and save the desktop as a setup.",
    image: "collages", alt: "A paper collage and a transparent collage with individually framed photos and editable captions on a real Mac desktop",
    caption: "Paper and transparent collage styles, captured on the Mac desktop with sample photos.",
    sections: [
      { id: "create", title: "Build a group you can keep editing", paragraphs: ["Choose Add → Create Collage in Arras Settings and select the photos you want together. Pick a background, spacing and border, or choose a transparent style. Try an Example provides an editable starting point if you want to see a finished arrangement first.", "A desktop collage stays live. Its photos remain independently movable and resizable, rather than becoming one flattened image. Drag the empty background to move the whole group. Drag a photo to rearrange it or move it out of the collage."] },
      { id: "arrange", title: "Keep the details aligned", paragraphs: ["Hover a photo’s corner to resize it. Alignment guides help you line up nearby edges, and the collage boundary grows or shrinks as you edit. Add and remove members in Edit Collage. Apply appearance to an individual photo or copy a look between photos without replacing their media.", "Add a caption or place a text label inside the collage. Depth and Space pinning belong to the group; a detached photo retains its own standalone settings. Lock the arrangement once it is where you want it."] },
      { id: "save", title: "Keep a version before experimenting", paragraphs: ["Save a named Setup to return to this desktop later. Arrangement Undo covers movement, resizing and membership changes during the session. Export an .arras backup when you need a portable copy of the layout and its managed media."] },
    ],
  },
  "reference-images-on-mac-desktop": {
    title: "Pin a photo above other windows on Mac",
    description: "Keep a photo or reference image visible above your Mac apps. Float it from the Arras menu bar, then resize it or lock it in place.",
    updated: "2026-11-15",
    image: "appearance", alt: "Independently shaped photo references and transparent collages on a real Mac desktop",
    caption: "Independent shapes and editable photo groups in an existing desktop capture. Floating depth is selected in each widget or collage’s controls.",
    sections: [
      { id: "float", title: "Float a photo from the menu bar", paragraphs: ["Add a photo in Arras. Click the Arras icon in the menu bar, open Widgets, find your photo and select Float Above Windows. You can also set Depth to Floating in the photo’s Settings controls. Resize it from a corner and lock the position once it is where you want it.", "Choose Pin to Desktop from the same menu to return the photo to the desktop. For several references, put them in a collage and set Depth to Floating in Edit Collage. Pin to this Space controls which desktop shows the photo. Use Floating when you want it to sit above app windows."] },
      { id: "context", title: "Keep the source and your edits", paragraphs: ["Reference Tools provides a non-destructive crop, quarter-turn rotation, flips and grayscale, plus a note and source link. These edits keep the managed original. You can also enable Paste as Widget, Add PDF Page and Capture Screen Region in Preferences → Menu bar.", "Screen-region capture needs macOS Screen Recording permission. Ordinary local photo widgets do not need Accessibility or Full Disk Access. Hide private reference images before sharing your screen: capture exclusion is a compatibility request and some recorders can still include visible widgets."] },
      { id: "reuse", title: "Save a reference arrangement", paragraphs: ["Keep different projects in named Setups and export a backup when you want to transfer a layout. Arras focuses on desktop images, collages and slideshows. It does not provide drawing, OCR, an infinite canvas or collaboration."] },
    ],
  },
};
