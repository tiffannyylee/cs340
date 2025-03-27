export enum Type {
    text = "Text",
    alias = "Alias",
    url = "URL",
    newline = "Newline",
  }
export interface PostSegmentDto {
    readonly text: string;
    readonly startPostion: number;
    readonly endPosition: number;
    readonly type: Type;
}