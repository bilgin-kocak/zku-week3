// [bonus] implement an example game from part d

pragma circom 2.0.0;
include "../../node_modules/circomlib/circuits/comparators.circom";
include "../../node_modules/circomlib/circuits/bitify.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";

// This is zkWORDLE Implementation.
// Here we will use different numbers for English Alphabet (e.g A:1, B:2, C:3, ... Z:26)
template Wordle() {
    // Public inputs
    signal input pubGuess1;
    signal input pubGuess2;
    signal input pubGuess3;
    signal input pubGuess4;
    signal input pubGuess5;
    signal input pubNumYellow;
    signal input pubNumGreen;
    signal input pubSolnHash;

    // Private inputs
    signal input privSoln1;
    signal input privSoln2;
    signal input privSoln3;
    signal input privSoln4;
    signal input privSoln5;
    signal input privSalt;

    // Output
    signal output solnHashOut;

    var guess[5] = [pubGuess1, pubGuess2, pubGuess3, pubGuess4, pubGuess5];
    var soln[5] =  [privSoln1, privSoln2, privSoln3, privSoln4, privSoln5];
    var j = 0;
    var k = 0;
    component lessThan[10];
    component equalGuess[10];
    component equalSoln[10];
    var equalIdx = 0;

    // Create a constraint that the solution and guess digits are all less than 27. Since the last letter is Z with a 26 value
    for (j=0; j<5; j++) {
        lessThan[j] = LessThan(5);
        lessThan[j].in[0] <== guess[j];
        lessThan[j].in[1] <== 27;
        lessThan[j].out === 1;
        lessThan[j+5] = LessThan(5);
        lessThan[j+5].in[0] <== soln[j];
        lessThan[j+5].in[1] <== 27;
        lessThan[j+5].out === 1;
    }

    // Count yellow & green
    var yellow = 0;
    var green = 0;
    var isGreen = 0;
    component equalHB[25];

    for (j=0; j<5; j++) {
        for (k=j; k<5; k++) {
            equalHB[5*j+k] = IsEqual();
            equalHB[5*j+k].in[0] <== soln[j];
            equalHB[5*j+k].in[1] <== guess[k];
            if (j != k) {
                yellow += equalHB[5*j+k].out;
            }
            
        }
    }

    component equalG[5];
    for (j=0; j<5; j++) {
        equalG[j] = IsEqual();
        equalG[j].in[0] <== soln[j];
        equalG[j].in[1] <== guess[j];
        green += equalG[j].out;
        // log(green);
    }



    // log(pubNumGreen);
    // log(green);
    // Create a constraint around the number of green
    component equalGreen = IsEqual();
    equalGreen.in[0] <== pubNumGreen;
    equalGreen.in[1] <== green;
    equalGreen.out === 1;
    

    // log(pubNumYellow);
    // log(yellow);
    // Create a constraint around the number of yellow
    component equalYellow = IsEqual();
    equalYellow.in[0] <== pubNumYellow;
    equalYellow.in[1] <== yellow;
    equalYellow.out === 1;

    // Verify that the hash of the private solution matches pubSolnHash
    component poseidon = Poseidon(6);
    poseidon.inputs[0] <== privSalt;
    poseidon.inputs[1] <== privSoln1;
    poseidon.inputs[2] <== privSoln2;
    poseidon.inputs[3] <== privSoln3;
    poseidon.inputs[4] <== privSoln4;
    poseidon.inputs[5] <== privSoln5;


    solnHashOut <== poseidon.out;
    // log(solnHashOut);
    // log(pubSolnHash);
    pubSolnHash === solnHashOut;
    
}

component main{public [pubGuess1, pubGuess2, pubGuess3, pubGuess4, pubGuess5, pubNumGreen, pubNumYellow, pubSolnHash]} = Wordle();