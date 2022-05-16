export class SearchCondition {
  public field: string;
  public operator: "equals" | "startsWith" | "endsWith" | "contains";
  public value: string;
}
