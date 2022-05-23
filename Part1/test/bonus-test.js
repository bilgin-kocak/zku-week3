// [bonus] unit test for bonus.circom

const chai = require("chai");
const path = require("path");

const wasm_tester = require("circom_tester").wasm;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;

describe("WORDLE Tests", function () {
    this.timeout(100000000);

    it("Correct Solution", async () => {
        const circuit = await wasm_tester("contracts/circuits/bonus.circom");
        await circuit.loadConstraints();

        const solution = "EARTH";
        const solutioninds = [5, 1, 18, 20, 8];  // integer of array representation of word EARTH
        const guess = "EARTH";
        const guessinds = [5, 1, 18, 20, 8];

        const INPUT = {
            "pubGuess1":5,
            "pubGuess2":1,
            "pubGuess3":18,
            "pubGuess4":20,
            "pubGuess5":8,
            "pubNumGreen":5,
            "pubNumYellow":0,
            "pubSolnHash":"8645298407424954469054626574924878998210043166571715272933567204623537071986",
            "privSoln1":5,
            "privSoln2":1,
            "privSoln3":18,  
            "privSoln4":20,      
            "privSoln5":8,          
            "privSalt":25,
        }

        const witness = await circuit.calculateWitness(INPUT, true);

        // console.log(witness);   
        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(witness[1],"8645298407424954469054626574924878998210043166571715272933567204623537071986");
    });

    it("Correct pubNumGreen", async () => {
        const circuit = await wasm_tester("contracts/circuits/bonus.circom");
        await circuit.loadConstraints();

        const solution = "EARTH";
        const solutioninds = [5, 1, 18, 20, 8];  // integer of array representation of word EARTH
        const guess = "EAGLE";
        const guessinds = [5, 1, 7, 12, 5];

        const INPUT = {
            "pubGuess1":5,
            "pubGuess2":1,
            "pubGuess3":7,
            "pubGuess4":12,
            "pubGuess5":5,
            "pubNumGreen":2,
            "pubNumYellow":1,
            "pubSolnHash":"8645298407424954469054626574924878998210043166571715272933567204623537071986",
            "privSoln1":5,
            "privSoln2":1,
            "privSoln3":18,  
            "privSoln4":20,      
            "privSoln5":8,          
            "privSalt":25,
        }

        const witness = await circuit.calculateWitness(INPUT, true);

        // console.log(witness);   
        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(witness[1],"8645298407424954469054626574924878998210043166571715272933567204623537071986");
    });

    it("Correct pubNumYellow", async () => {
        const circuit = await wasm_tester("contracts/circuits/bonus.circom");
        await circuit.loadConstraints();

        const solution = "EARTH";
        const solutioninds = [5, 1, 18, 20, 8];  // integer of array representation of word EARTH
        const guess = "EAGER";
        const guessinds = [5, 1, 7, 5, 18];

        const INPUT = {
            "pubGuess1":5,
            "pubGuess2":1,
            "pubGuess3":7,
            "pubGuess4":5,
            "pubGuess5":18,
            "pubNumGreen":2,
            "pubNumYellow":2,
            "pubSolnHash":"8645298407424954469054626574924878998210043166571715272933567204623537071986",
            "privSoln1":5,
            "privSoln2":1,
            "privSoln3":18,  
            "privSoln4":20,      
            "privSoln5":8,          
            "privSalt":25,
        }

        const witness = await circuit.calculateWitness(INPUT, true);

        // console.log(witness);   
        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(witness[1],"8645298407424954469054626574924878998210043166571715272933567204623537071986");
    });
});