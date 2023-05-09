export enum TokenType {
  // Literal Types
  Number,
  Identifier,
  // Keywords
  Let,
  Const,
  // Grouping * Operators
  BinaryOperator,
  Equals,
  Comma,
  Colon,
  Semicolon,
  OpenParen, // (
  CloseParen, // )
  OpenBrace, // {
  CloseBrace, // }
  EOF, // End of File
}

const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  const: TokenType.Const,
};

export interface Token {
  value: string;
  type: TokenType;
}

function token(value = "", type: TokenType): Token {
  return { value, type };
}

function isAlpha(src: string) {
  return src.toLowerCase() !== src.toUpperCase();
}

function isInt(src: string) {
  return parseInt(src) >= 0 && parseInt(src) <= 9;
}

function isSkippable(str: string) {
  return str == " " || str == "\n" || str == "\t" || str == "\r";
}

export function tokenize(sourceCode: string): Token[] {
  const tokens = new Array<Token>();
  const src = sourceCode.split("");

  while (src.length > 0) {
    if (src[0] == "(") {
      tokens.push(token(src.shift(), TokenType.OpenParen));
    } else if (src[0] == ")") {
      tokens.push(token(src.shift(), TokenType.CloseParen));
    } else if (src[0] == "{") {
      tokens.push(token(src.shift(), TokenType.OpenBrace));
    } else if (src[0] == "}") {
      tokens.push(token(src.shift(), TokenType.CloseBrace));
    } //Handle binary operators
    else if (
      src[0] == "+" ||
      src[0] == "-" ||
      src[0] == "*" ||
      src[0] == "/" ||
      src[0] == "%"
    ) {
      tokens.push(token(src.shift(), TokenType.BinaryOperator));
    } else if (src[0] == "=") {
      tokens.push(token(src.shift(), TokenType.Equals));
    } else if (src[0] == ";") {
      tokens.push(token(src.shift(), TokenType.Semicolon));
    }else if (src[0] == ":") {
      tokens.push(token(src.shift(), TokenType.Colon));
    }else if (src[0] == ",") {
      tokens.push(token(src.shift(), TokenType.Comma));
    } else {
      if (isSkippable(src[0])) {
        src.shift();
      } else if (isInt(src[0])) {
        let num = "";
        while (isInt(src[0])) {
          num += src.shift();
        }
        tokens.push(token(num, TokenType.Number));
      } else if (isAlpha(src[0])) {
        let ident = "";
        while (src.length > 0 && isAlpha(src[0])) {
          ident += src.shift();
        }

        //check for reserved keywords
        const reserved = KEYWORDS[ident];
        if (typeof reserved == "number") {
          tokens.push(token(ident, reserved));
        } else {
          tokens.push(token(ident, TokenType.Identifier));
        }
      } else {
        console.log("Unrecognized character found in source: ", src[0]);
        Deno.exit(1);
      }
    }
  }
  tokens.push(token("EndOfFile", TokenType.EOF));
  return tokens;
}
