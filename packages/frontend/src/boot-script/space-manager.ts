import chatConfig from './getConfig';

export default class SpaceManager {
  private readonly buttonWidth = 48;
  private readonly chatSpace = {
    spaceWithBtn: 20,
    width: 400,
    maxHeight: 700,
    minHeight: 80
  };

  chatContent () {
    const buttonSpace = this.button();
    return {
      ...this.chatSpace,
      position: buttonSpace.position,
      left: buttonSpace.left,
      right: buttonSpace.right,
      bottom: buttonSpace.bottom + buttonSpace.height + this.chatSpace.spaceWithBtn
    }
  }

  button () {
    return {
      position: chatConfig.position,
      left: chatConfig.position === 'left' ? chatConfig.positionLeft : undefined,
      right: chatConfig.position === 'right' ? chatConfig.positionRight : undefined,
      bottom: chatConfig.positionBottom,
      width: this.buttonWidth,
      height: this.buttonWidth
    }
  }
}