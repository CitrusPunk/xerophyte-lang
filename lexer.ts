export enum TokenType {
  Number,
  Identifier,
  Equals,
  OpenParen,
  CloseParen,
  BinaryOperator,
  Let,
}

export interface Token {
  value: string;
  type: TokenType;
}

function token(value = "", type: TokenType): Token {
  return { value, type };
}

export function tokenize(sourceCode: string): Token[] {
  let tokens = new Array<Token>();
  let src = sourceCode.split("");

  while (src.length > 0) {
    if(src[0] =="("){
        tokens.push(token(src.shift(), TokenType.OpenParen))
    }else if(src[0] ==")"){
        tokens.push(token(src.shift(), TokenType.CloseParen))
    }else if(src[0] =="+" || src[0] =="-" || src[0] =="*" || src[0] =="/"){
        tokens.push(token(src.shift(), TokenType.BinaryOperator))
    }else if(src[0] =="="){
        tokens.push(token(src.shift(), TokenType.Equals))
  }

  return tokens;
}
