export default interface Todo {
    id: number;
    body: string;
    completed?: boolean;
    created?: Date;
    updated?: Date;
  }