export class Utils {
  static isEmpty(value: any) {
    return value === undefined || value === null || value === "";
  }

  static convertToTitleCase(value: string) {
    return value.charAt(0).toUpperCase() + value.substr(1).toLowerCase();
  }
}
