# pip install pillow
from PIL import Image

def flip_sprite(image_path, output_path, frame_width, frame_height):
    """
    Flips and reverts a sprite sheet image.

    :param image_path: Path to the sprite sheet image.
    :param output_path: Path to save the flipped sprite sheet image.
    :param frame_width: Width of each frame in the sprite sheet.
    :param frame_height: Height of each frame in the sprite sheet.
    """
    sprite_sheet = Image.open(image_path)
    sheet_width, sheet_height = sprite_sheet.size

    # Calculate the number of frames in the sprite sheet
    num_frames = sheet_width // frame_width

    # Create a new image to hold the flipped frames
    flipped_sheet = Image.new("RGBA", (sheet_width, frame_height))

    # Process each frame
    for i in range(num_frames):
        frame = sprite_sheet.crop((i * frame_width, 0, (i + 1) * frame_width, frame_height))
        flipped_frame = frame.transpose(Image.FLIP_LEFT_RIGHT)
        flipped_sheet.paste(flipped_frame, (i * frame_width, 0))

    # Save the flipped sprite sheet
    flipped_sheet.save(output_path)
    print(f"Flipped sprite sheet saved to {output_path}")

flip_sprite("./CatCharacterAnimations/SpriteSheets/AlternativeColour/Outlined_2_Alternative_Colour_Cat_Run-Sheet.png", "./CatCharacterAnimations/SpriteSheets/AlternativeColour/Outlined_2_Alternative_Colour_Cat_Run_Left-Sheet.png", frame_width=32, frame_height=32)
flip_sprite("./CatCharacterAnimations/SpriteSheets/Outlined_2_Cat_Run-Sheet.png", "./CatCharacterAnimations/SpriteSheets/Outlined_2_Cat_Run_Left-Sheet.png", frame_width=32, frame_height=32)
