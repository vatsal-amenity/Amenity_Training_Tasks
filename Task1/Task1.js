const readline = require('readline');
const { performance } = require('perf_hooks'); 

// 1. Function based approach
function fiboFunction(n) {
    console.log("------------function based approach------------");
    
    let a = 0, b = 1;

    let startTime = performance.now(); 
    process.stdout.write("Series: "); 
    
    for (let i = 2; i <= n; i++) {
        process.stdout.write(a + " , ");
        
        let next = a + b;
        a = b;
        b = next;
    }
    console.log(""); 

    let endTime = performance.now();
    let duration = (endTime - startTime).toFixed(4); 

    console.log("Execution Time: " + duration + " milliseconds");
}

// 2. Class based approach
class Fibo {
    exec(n) {
        console.log("-------------------class based approach-------------------");
        
        let a = 0, b = 1;
        let startTime = performance.now();

        process.stdout.write("Series: ");
        
        for (let i = 2; i <= n; i++) {
            process.stdout.write(a + " , ");
            
            let next = a + b;
            a = b;
            b = next;
        }
        console.log("");

        let endTime = performance.now();
        let duration = (endTime - startTime).toFixed(4);

        console.log("Execution Time: " + duration + " milliseconds");
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter the num : ", function(input) {
    let count = parseInt(input); 

    // Function call karyu
    fiboFunction(count);

    // Class no object banavi ne call karyu
    let cal = new Fibo();
    cal.exec(count);

    rl.close();
});