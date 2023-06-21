interface HandleResult {
  text?: string | undefined;
  thread_ts?: string | undefined;
  reply_broadcast?: boolean | undefined;
  blocks?: Block[] | undefined;
}

interface Block {
  type: string;
  text?: TextElement | undefined;
  elements?: ActionElement[] | undefined;
}

interface TextElement {
  type: string;
  text: string;
}

interface ActionElement {
  type: string;
  text: TextElement;
  value: string;
  action_id: string;
}

export { HandleResult };
