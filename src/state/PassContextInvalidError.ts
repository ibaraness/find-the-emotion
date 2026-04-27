/** Thrown when `activePass` / `passes` no longer match the pass this screen was mounted with. */
export class PassContextInvalidError extends Error {
  static readonly userMessage =
    'This step is no longer in sync with your session. Please go back or start over from the home screen.'

  override readonly name = 'PassContextInvalidError'

  constructor() {
    super(PassContextInvalidError.userMessage)
  }
}
