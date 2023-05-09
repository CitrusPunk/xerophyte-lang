# Xerophyte
An attempt to create an interpreted programming language. The first attempt tries to follow [tylerlaceby's](https://www.youtube.com/@tylerlaceby) tutorial on youtube.
The language will be implemented in TypeScript and it's REPL and Interpreter will run on [Deno](https://deno.com/runtime).
Later in the process I'll try to translate the learned knowledge to adjust and extend the language.
It shall be dry and short like a [xerophyte](https://en.wikipedia.org/wiki/Xerophyte).

## Requirements
Xerophyte requires the following to run:
 - [Xerophyte Repository](https://github.com/CitrusPunk/xerophyte-lang) via ```git clone https://github.com/CitrusPunk/xerophyte-lang```  
 - [Deno](https://deno.com/runtime) via [installation guide](https://deno.com/manual@v1.33.1/getting_started/installation)  

## Run
When all requirements are set up, you can simply start the REPL with:
```Deno run -A main.ts```

## Checklist
- [x] Lexer
- [x] AST
- [x] Parser
- [x] Interpreter
- [x] Values
- [X] Environments & Variable Storage 
- [X] Variable Declarations
- [X] Assignment Expressions
- [X] Objects & User Defined Structures 
- [ ] FunctionCalls & Object Member Expressions
- [ ] Native Global Functions
- [ ] User Defined Functions & Closures
