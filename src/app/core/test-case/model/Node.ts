import { TestCase } from './TestCase';

export class Node {
    technicalID: number;
    id: string;
    seq: number;
    text: string;
    type: string;
    parent: string;
    testCase: TestCase;
}