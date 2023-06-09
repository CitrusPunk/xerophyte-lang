import {
  Stmt,
  Program,
  Expr,
  BinaryExpr,
  NumericLiteral,
  Identifier,
  VarDeclaration,
  AssignmentExpr,
  Property,
  ObjectLiteral,
} from "./ast.ts";

import { tokenize, Token, TokenType } from "./lexer.ts";

// Orders of Prescidence
// AssignmentExpr
// MemberExpr
// FunctionCall
// LogicalExpr
// ComparisonExpr
// AdditiveExpr
// MultiplicitaveExpr
// UnaryExpr
// PrimaryExpr

export default class Parser {
  private tokens: Token[] = [];

  private not_eof(): boolean {
    return this.tokens[0].type != TokenType.EOF;
  }

  private at() {
    return this.tokens[0];
  }

  private eat() {
    const prev = this.tokens.shift() as Token;
    return prev;
  }

  private expect(type: TokenType, err: any) {
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type != type) {
      console.error("Parser Error:\n", err, prev, " - Expecting: ", type);
      Deno.exit(1);
    }
    return prev;
  }

  private parse_stmt(): Stmt {
    // skipt to parse_expr
    switch (this.at().type) {
      case TokenType.Let:
      case TokenType.Const:
        return this.parse_var_declaration();
      default:
        return this.parse_expr();
    }
  }

  // LET IDENT;
  // CONST/LET IDENT = EXPR;
  private parse_var_declaration(): Stmt {
    const isConstant = this.eat().type == TokenType.Const;
    const identifier = this.expect(
      TokenType.Identifier,
      "Expected identifier name following let|const kexwords"
    ).value;

    if (this.at().type == TokenType.Semicolon) {
      this.eat(); // expect semicolon
      if (isConstant) {
        throw `Must assign value to constant expression. No value provided`;
      }
      return {
        kind: "VarDeclaration",
        identifier,
        constant: false,
      } as VarDeclaration;
    }

    this.expect(
      TokenType.Equals,
      "Expected equals token following identifier in var declaration"
    );
    const declaration = {
      kind: "VarDeclaration",
      value: this.parse_expr(),
      constant: isConstant,
      identifier,
    } as VarDeclaration;

    this.expect(
      TokenType.Semicolon,
      "Variable declaration statement must end with semicolon."
    );
    return declaration;
  }

  private parse_expr(): Expr {
    return this.parse_assignment_expr();
  }

  private parse_assignment_expr(): Expr {
    const left = this.parse_object_expr(); // switch this out with objectExpr

    if (this.at().type == TokenType.Equals) {
      this.eat(); // advance past equals
      const value = this.parse_assignment_expr();
      return { value, assigne: left, kind: "AssignmentExpr" } as AssignmentExpr;
    }

    return left;
  }

  private parse_object_expr(): Expr {
    if (this.at().type !== TokenType.OpenBrace) {
      return this.parse_additive_expr();
    }

    this.eat(); // advance past open brace
    const properties = new Array<Property>();

    while (this.not_eof() && this.at().type != TokenType.CloseBrace) {
      // {key: val, key2: val}
      const key = this.expect(
        TokenType.Identifier,
        "Object literal key expected."
      ).value;

      // { key, }
      if (this.at().type == TokenType.Comma) {
        this.eat(); // advance past comma
        properties.push({ kind: "Property", key });
        continue;
      }

      // { key }
      if (this.at().type == TokenType.CloseBrace) {
        properties.push({ kind: "Property", key });
        continue;
      }

      // { key : value }
      this.expect(TokenType.Colon, "Missing Colon following in ObjectExpr.");
      const value = this.parse_expr();
      properties.push({ kind: "Property", key, value });
      if (this.at().type != TokenType.CloseBrace) {
        this.expect(TokenType.Comma, "Expected Comma or Closing Bracket follwoing property.");
      }
    }

    this.expect(TokenType.CloseBrace, "Object literal missing closing brace.");
    return { kind: "ObjectLiteral", properties } as ObjectLiteral;
  }

  // (10 + 5) - 5
  private parse_additive_expr(): Expr {
    let left = this.parse_multiplicative_expr();

    while (this.at().value == "+" || this.at().value == "-") {
      const operator = this.eat().value;
      const right = this.parse_multiplicative_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parse_multiplicative_expr(): Expr {
    let left = this.parse_primary_expr();

    while (
      this.at().value == "*" ||
      this.at().value == "/" ||
      this.at().value == "%"
    ) {
      const operator = this.eat().value;
      const right = this.parse_primary_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parse_primary_expr(): Expr {
    const tk = this.at().type;

    switch (tk) {
      case TokenType.Identifier:
        return { kind: "Identifier", symbol: this.eat().value } as Identifier;
      case TokenType.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.eat().value),
        } as NumericLiteral;
      case TokenType.OpenParen:
        this.eat(); // eat the opening parenthisis
        const value = this.parse_expr();
        this.expect(
          TokenType.CloseParen,
          "Unexpected token found inside parenthisesed expression. Expected Closing parenthisis."
        ); // closing parenthisis
        return value;
      default:
        console.error("Unexpected token found during parsing!", this.at());
        Deno.exit(1);
    }
  }

  public produceAST(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode); // Get all tokens from the lexer
    const program: Program = {
      kind: "Program",
      body: [],
    };

    // Parse unti end of file
    while (this.not_eof()) {
      program.body.push(this.parse_stmt());
    }

    return program;
  }
}
