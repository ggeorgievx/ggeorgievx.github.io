from PIL import Image

def reverse_sprite_sheet(input_path, output_path, frame_width, frame_height):
    # Open the input sprite sheet
    sprite_sheet = Image.open(input_path)

    # Calculate the number of frames in the sprite sheet
    sheet_width, sheet_height = sprite_sheet.size
    num_frames = sheet_width // frame_width

    # List to store individual frames
    frames = []

    # Extract frames from the sprite sheet
    for i in range(num_frames):
        left = i * frame_width
        upper = 0
        right = left + frame_width
        lower = upper + frame_height
        frame = sprite_sheet.crop((left, upper, right, lower))
        frames.append(frame)

    # Reverse the order of frames
    frames.reverse()

    # Create a new image to store the reversed sprite sheet
    reversed_sheet = Image.new('RGBA', (sheet_width, sheet_height))

    # Paste the reversed frames into the new sprite sheet
    for i, frame in enumerate(frames):
        left = i * frame_width
        upper = 0
        reversed_sheet.paste(frame, (left, upper))

    # Save the reversed sprite sheet
    reversed_sheet.save(output_path)

reverse_sprite_sheet(
    './CatCharacterAnimations/SpriteSheets/AlternativeColour/Outlined_2_Alternative_Colour_Cat_Run_Left-Sheet.png',
    './CatCharacterAnimations/SpriteSheets/AlternativeColour/Outlined_2_Alternative_Colour_Cat_Run_Left-Sheet.png',
    32,
    32
)
reverse_sprite_sheet(
    './CatCharacterAnimations/SpriteSheets/AlternativeColour/Outlined_2_Alternative_Colour_Cat_Run-Sheet.png',
    './CatCharacterAnimations/SpriteSheets/AlternativeColour/Outlined_2_Alternative_Colour_Cat_Run-Sheet.png',
    32,
    32
)
