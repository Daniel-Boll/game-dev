import * as w4 from "../wasm4";

export class DialogUI {
  private title: string = "";
  private messages: Array<string> = [];
  private isOpen: bool = false;
  private currentMessage: i8 = -1;

  public setTitle(title: string): DialogUI {
    this.title = title;
    return this;
  }

  public setMessages(messages: Array<string>): DialogUI {
    this.messages = messages;
    return this;
  }

  public open(): DialogUI {
    if (<i32>this.currentMessage < this.messages.length - 1) {
      this.isOpen = true;
      this.currentMessage++;
    } else {
      this.isOpen = false;
    }
    return this;
  }

  public draw(): void {
    // Create a rectangle in the bottom for the dialog
    if (this.isOpen) {
      w4.rect(0, 120, 160, 40);
      store<u16>(w4.DRAW_COLORS, 0x2);
      w4.text(this.messages[this.currentMessage], 10, 130);
    }
  }
}
