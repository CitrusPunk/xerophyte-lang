import Parser from "./frontend/parser.ts";
import Environment from "./runtime/environment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { MK_NULL, MK_BOOL, MK_NUMBER } from "./runtime/values.ts";

repl(); 

function repl() {
    const parser = new Parser();
    const env = new Environment();

    // Create default global environment
    env.declareVar("true", MK_BOOL(true), true);
    env.declareVar("false", MK_BOOL(false), true);
    env.declareVar("null", MK_NULL(), true );

    // Init REPL
    console.log("\nRepl v.01");
    // continue until user stops or exits
    while(true){
        const input = prompt("> ");

        // Check for no user input or exit keyword
        if(!input || input.includes("exit")){
            Deno.exit(1);
        }

        // produce AST from source-code
        const program = parser.produceAST(input);

        const result = evaluate(program, env);
        console.log(result);
    }
}
