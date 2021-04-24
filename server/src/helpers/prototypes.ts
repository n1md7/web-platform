interface String {
  equalTo(value: string): boolean
}

String.prototype.equalTo = function (value: string): boolean{
  return this.trim() === value;
};