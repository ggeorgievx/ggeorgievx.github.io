const canvas = document.getElementsByTagName('canvas')[0];
const CANVAS_WIDTH = 64;
const CANVAS_HEIGHT = 64;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
document.body.style.width = `${CANVAS_WIDTH}px`;
document.body.style.height = `${CANVAS_HEIGHT}px`;
const context = canvas.getContext('2d');
const IMAGE_WIDTH = 32;
const IMAGE_HEIGHT = 32;
const STAGGER_FRAMES = 20;
const GLUE_STAGGER_FRAMES = 8;
const urlParams = new URLSearchParams(window.location.search);
const CHARACTER = urlParams.get('character') || 'io.CD Pet'; // 'EMIL' | 'ROGO'
document.title = CHARACTER;
const CHARACTER_TO_ICON_AND_ACTIONS_MAPPING = {
    EMIL: {
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAATBAMAAAC97EqZAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAkUExURQAAAAAAAG5WV+ibm6iRkSMWGBdMbhxcg0Q3gaesuiNBQv///4edfGYAAAABdFJOUwBA5thmAAAAAWJLR0QLH9fEwAAAAAd0SU1FB+gGAgsYMyIUGMoAAABxSURBVAjXY2BgYBBgYGQAAUZFBiEBEEPISFAZylBSVgTJKAEBhKHipOIIEQlSVYQxlICqhZSUVELAIkCWGli7eFpaGkRNeXkZjFExEcSY2dHRBhFJS8sCKmZkkFq1ahXIGEEtCINRSWuhoBTIHBAJRAB2JBVfoKtkKQAAAABJRU5ErkJggg==',
        actions: {
            'RUN-LEFT': {
                path: './sprites/CatCharacterAnimations/SpriteSheets/AlternativeColour/Outlined_2_Alternative_Colour_Cat_Run_Left-Sheet.png',
                image: null,
                length: 0
            },
            'RUN-RIGHT': {
                path: './sprites/CatCharacterAnimations/SpriteSheets/AlternativeColour/Outlined_2_Alternative_Colour_Cat_Run-Sheet.png',
                image: null,
                length: 0
            },
            FALL: {
                path: './sprites/CatCharacterAnimations/SpriteSheets/AlternativeColour/Outlined_4_Alternative_Colour_Cat_Fall-Sheet.png',
                image: null,
                length: 0
            },
            DRAG: {
                path: './sprites/CatCharacterAnimations/SpriteSheets/AlternativeColour/Outlined_8_Alternative_Colour_Cat_Ledge_Grab_Idle-Sheet.png',
                image: null,
                length: 0
            },
            DEATH: {
                path: './sprites/CatCharacterAnimations/SpriteSheets/AlternativeColour/Outlined_18_Alternative_Colour_Cat_Death-Sheet.png',
                image: null,
                length: 0
            }
        }
    },
    ROGO: {
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAATBAMAAAC97EqZAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAkUExURQAAAAAAAPn10uFhafSyeiMWGF4vb3s3gY9DSVhHSFIeI////zXZTvcAAAABdFJOUwBA5thmAAAAAWJLR0QLH9fEwAAAAAd0SU1FB+gGAgc3DI909P4AAABxSURBVAjXY2BgYBBgYGQAAUZFBiEBEEPISFAZylBSVgTJKAEBhKHipOIIEQlSVYQxlICqhZSUVELAIkCWGli7eFpaGkRNeXkZjFExEcSY2dHRBhFJS8sCKmZkkFq1ahXIGEEtCINRSWuhoBTIHBAJRAB2JBVfoKtkKQAAAABJRU5ErkJggg==',
        actions: {
            'RUN-LEFT': {
                path: './sprites/CatCharacterAnimations/SpriteSheets/Outlined_2_Cat_Run_Left-Sheet.png',
                image: null,
                length: 0
            },
            'RUN-RIGHT': {
                path: './sprites/CatCharacterAnimations/SpriteSheets/Outlined_2_Cat_Run-Sheet.png',
                image: null,
                length: 0
            },
            FALL: {
                path: './sprites/CatCharacterAnimations/SpriteSheets/Outlined_4_Cat_Fall-Sheet.png',
                image: null,
                length: 0
            },
            DRAG: {
                path: './sprites/CatCharacterAnimations/SpriteSheets/Outlined_8_Cat_Ledge_Grab_Idle-Sheet.png',
                image: null,
                length: 0
            },
            DEATH: {
                path: './sprites/CatCharacterAnimations/SpriteSheets/Outlined_18_Cat_Death-Sheet.png',
                image: null,
                length: 0
            }
        }
    }
};
const CHARACTER_SPRITE_PADDING = {
    TOP: 13 * 2,
    RIGHT: 8 * 2,
    BOTTOM: 5 * 2,
    LEFT: 8 * 2
};
const APPS_TO_IGNORE = [
    'glue42-application-manager'
];
const CONSTRAINTS = {
    MIN_TOP: -CHARACTER_SPRITE_PADDING.TOP,
    MAX_TOP: null,
    MIN_LEFT: -CHARACTER_SPRITE_PADDING.LEFT,
    MAX_LEFT: null
};
const SPEED = {
    RUN: 4,
    FALL: 10
};
const FALL_HEIGHT_LEADING_TO_DEATH = 400;
let frame = 0;
let spriteFrame = 0;
let currentState = Math.random() < 0.5 ? 'RUN-LEFT' : 'RUN-RIGHT'; // 'RUN-LEFT' | 'RUN-RIGHT' | 'FALL' | 'DRAG' | 'DEATH'
let stateChange = false;
let glue = null;
let myWindow = null;
let myDisplay = null;
let startingFallHeight = Number.MAX_SAFE_INTEGER;

const setCurrentState = (newState) => {
    currentState = newState;
    spriteFrame = 0;
    stateChange = true;

    if (newState === 'DRAG') {
        startingFallHeight = Number.MAX_SAFE_INTEGER;
    } else if (currentState === 'FALL') {
        startingFallHeight = myWindow.bounds.top + CANVAS_HEIGHT - CHARACTER_SPRITE_PADDING.BOTTOM;
    }
};
const loadImage = async (url) => {
    return new Promise((resolve) => {
        const image = new Image();

        image.onload = (() => resolve(image));

        image.src = url;
    });
};

(async () => {
    const gluePromise = window.Glue()
        .then((glue) => {
            window.glue = glue;

            myWindow = glue.windows.my();

            myWindow.onClosing(() => {
                setCurrentState('DEATH');

                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, 5000);
                });
            });

            return Promise.all([
                myWindow.setIcon(CHARACTER_TO_ICON_AND_ACTIONS_MAPPING[CHARACTER].icon),
                myWindow.setOnTop('always'),
                myWindow.resizeTo(CANVAS_WIDTH, CANVAS_HEIGHT),
                myWindow.getDisplay().then((display) => {
                    myDisplay = display;
                    CONSTRAINTS.MAX_TOP = myDisplay.workArea.height - CANVAS_HEIGHT + CHARACTER_SPRITE_PADDING.BOTTOM;
                    CONSTRAINTS.MAX_LEFT = myDisplay.workArea.width - CANVAS_WIDTH + CHARACTER_SPRITE_PADDING.RIGHT;

                    return myWindow.moveTo(CONSTRAINTS.MAX_TOP, myDisplay.workArea.width / 2 - CANVAS_WIDTH / 2);
                })
            ]);
        });
    const imageLoadPromises = Object.keys(CHARACTER_TO_ICON_AND_ACTIONS_MAPPING[CHARACTER].actions)
        .map((action) => {
            return loadImage(CHARACTER_TO_ICON_AND_ACTIONS_MAPPING[CHARACTER].actions[action].path)
                .then((image) => {
                    CHARACTER_TO_ICON_AND_ACTIONS_MAPPING[CHARACTER].actions[action].image = image;
                    CHARACTER_TO_ICON_AND_ACTIONS_MAPPING[CHARACTER].actions[action].length = image.width / IMAGE_WIDTH - 1;
                });
        });

    await Promise.all([
        gluePromise,
        ...imageLoadPromises
    ]);

    canvas.onmousedown = () => {
        setCurrentState('DRAG');
    };
    document.onmouseup = () => {
        setCurrentState('FALL');
    };
    document.onmousemove = (event) => {
        if (currentState === 'DRAG') {
            const top = event.screenY - CHARACTER_SPRITE_PADDING.TOP <= 0 ?
                -CHARACTER_SPRITE_PADDING.TOP :
                event.screenY - CHARACTER_SPRITE_PADDING.TOP >= myDisplay.workArea.height - CANVAS_HEIGHT + CHARACTER_SPRITE_PADDING.BOTTOM ?
                    myDisplay.workArea.height - CANVAS_HEIGHT + CHARACTER_SPRITE_PADDING.BOTTOM :
                    event.screenY - CANVAS_HEIGHT / 2 - 12;
            const left = event.screenX - CHARACTER_SPRITE_PADDING.LEFT <= 0 ?
                -CHARACTER_SPRITE_PADDING.LEFT :
                event.screenX - CHARACTER_SPRITE_PADDING.LEFT >= myDisplay.workArea.width - CANVAS_WIDTH + CHARACTER_SPRITE_PADDING.RIGHT ?
                    myDisplay.workArea.width - CANVAS_WIDTH + CHARACTER_SPRITE_PADDING.RIGHT :
                    event.screenX - CANVAS_WIDTH / 2;

            myWindow.moveTo(top, left);
        }
    };

    const animate = () => {
        if (frame % GLUE_STAGGER_FRAMES === 0 || stateChange) {
            switch (currentState) {
                case 'FALL':
                    if (myWindow.bounds.top < CONSTRAINTS.MAX_TOP) {
                        myWindow.moveTo(Math.min(myWindow.bounds.top + SPEED.FALL, CONSTRAINTS.MAX_TOP), myWindow.bounds.left);
                    } else {
                        if (startingFallHeight + FALL_HEIGHT_LEADING_TO_DEATH <= myWindow.bounds.top + CANVAS_HEIGHT - CHARACTER_SPRITE_PADDING.BOTTOM) {
                            setCurrentState('DEATH');
                        } else {
                            setCurrentState(Math.random() < 0.5 ? 'RUN-LEFT' : 'RUN-RIGHT');
                        }
                    }
                    break;
                case 'RUN-RIGHT':
                    if (myWindow.bounds.left < CONSTRAINTS.MAX_LEFT) {
                        myWindow.moveTo(myWindow.bounds.top, Math.min(myWindow.bounds.left + SPEED.RUN, CONSTRAINTS.MAX_LEFT));
                    } else {
                        setCurrentState('RUN-LEFT');
                    }
                    break;
                case 'RUN-LEFT':
                    if (myWindow.bounds.left > CONSTRAINTS.MIN_LEFT) {
                        myWindow.moveTo(myWindow.bounds.top, Math.max(myWindow.bounds.left - SPEED.RUN, CONSTRAINTS.MIN_LEFT));
                    } else {
                        setCurrentState('RUN-RIGHT');
                    }
                    break;
                default:
                    break;
            }
        }

        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.drawImage(
            CHARACTER_TO_ICON_AND_ACTIONS_MAPPING[CHARACTER].actions[currentState].image,
            spriteFrame * IMAGE_WIDTH, 0, IMAGE_WIDTH, IMAGE_HEIGHT,
            0, 0, CANVAS_WIDTH, CANVAS_HEIGHT
        );

        if (frame % STAGGER_FRAMES === 0 || stateChange) {
            if (spriteFrame < CHARACTER_TO_ICON_AND_ACTIONS_MAPPING[CHARACTER].actions[currentState].length) {
                spriteFrame++;
            } else {
                if (currentState === 'DEATH') {
                    window.close();
                }

                spriteFrame = 0;
            }

            stateChange = false;
        }

        const closestWindowBelow = window.glue.windows.list().reduce((currentClosestWindowBelow, window) => {
            if (
                window.isVisible &&
                !APPS_TO_IGNORE.includes(window.application.name) &&
                window.bounds.top >= myWindow.bounds.top + CANVAS_HEIGHT - CHARACTER_SPRITE_PADDING.BOTTOM - SPEED.FALL &&
                window.bounds.left < myWindow.bounds.left + CANVAS_WIDTH - CHARACTER_SPRITE_PADDING.RIGHT &&
                window.bounds.left + window.bounds.width > myWindow.bounds.left + CHARACTER_SPRITE_PADDING.LEFT &&
                window.bounds.top < (currentClosestWindowBelow?.bounds.top || Number.MAX_SAFE_INTEGER)
            ) {
                return window;
            }

            return currentClosestWindowBelow;
        }, null);
        if (closestWindowBelow) {
            CONSTRAINTS.MAX_TOP = closestWindowBelow.bounds.top - CANVAS_HEIGHT + CHARACTER_SPRITE_PADDING.BOTTOM;
        } else {
            CONSTRAINTS.MAX_TOP = myDisplay.workArea.height - CANVAS_HEIGHT + CHARACTER_SPRITE_PADDING.BOTTOM;
        }
        const closestWindowLeft = window.glue.windows.list().reduce((currentClosestWindowLeft, window) => {
            if (
                window.isVisible &&
                !APPS_TO_IGNORE.includes(window.application.name) &&
                window.bounds.left + window.bounds.width <= myWindow.bounds.left - CHARACTER_SPRITE_PADDING.LEFT &&
                window.bounds.top < myWindow.bounds.top + CANVAS_HEIGHT - CHARACTER_SPRITE_PADDING.BOTTOM &&
                window.bounds.top + window.bounds.height > myWindow.bounds.top + CHARACTER_SPRITE_PADDING.TOP &&
                window.bounds.left > (currentClosestWindowLeft?.bounds.left || Number.MIN_SAFE_INTEGER)
            ) {
                return window;
            }

            return currentClosestWindowLeft;
        }, null);
        if (closestWindowLeft) {
            CONSTRAINTS.MIN_LEFT = closestWindowLeft.bounds.left + closestWindowLeft.bounds.width + CHARACTER_SPRITE_PADDING.RIGHT;
        } else {
            CONSTRAINTS.MIN_LEFT = -CHARACTER_SPRITE_PADDING.LEFT;
        }
        const closestWindowRight = window.glue.windows.list().reduce((currentClosestWindowRight, window) => {
            if (
                window.isVisible &&
                !APPS_TO_IGNORE.includes(window.application.name) &&
                window.bounds.left >= myWindow.bounds.left + CANVAS_WIDTH - CHARACTER_SPRITE_PADDING.RIGHT &&
                window.bounds.top < myWindow.bounds.top + CANVAS_HEIGHT - CHARACTER_SPRITE_PADDING.BOTTOM &&
                window.bounds.top + window.bounds.height > myWindow.bounds.top + CHARACTER_SPRITE_PADDING.TOP &&
                window.bounds.left < (currentClosestWindowRight?.bounds.left || Number.MAX_SAFE_INTEGER)
            ) {
                return window;
            }

            return currentClosestWindowRight;
        }, null);
        if (closestWindowRight) {
            CONSTRAINTS.MAX_LEFT = closestWindowRight.bounds.left - CANVAS_WIDTH + CHARACTER_SPRITE_PADDING.RIGHT;
        } else {
            CONSTRAINTS.MAX_LEFT = myDisplay.workArea.width - CANVAS_WIDTH + CHARACTER_SPRITE_PADDING.RIGHT;
        }

        if (['RUN-LEFT', 'RUN-RIGHT'].includes(currentState)) {
            if (myWindow.bounds.top + CANVAS_HEIGHT - CHARACTER_SPRITE_PADDING.BOTTOM < CONSTRAINTS.MAX_TOP) {
                setCurrentState('FALL');
            }
        }

        frame++;

        requestAnimationFrame(animate);
    };

    animate();
})();
