import { App, AppMode } from "../../src/common/app";
import { AppEvent, AppEventEmitter } from "../../src/common/events";
import { Memento } from "../../src/common/memento";
import { Disposable } from "../../src/pure/disposable-object";
import { createMockLogger } from "./loggerMock";
import { createMockMemento } from "../mock-memento";
import { testCredentialsWithStub } from "../factories/authentication";
import { Credentials } from "../../src/common/authentication";
import { JsonValidator } from "../../src/data-serialization/json-validator";

export function createMockApp({
  extensionPath = "/mock/extension/path",
  workspaceStoragePath = "/mock/workspace/storage/path",
  globalStoragePath = "/mock/global/storage/path",
  createEventEmitter = <T>() => new MockAppEventEmitter<T>(),
  executeCommand = jest.fn(() => Promise.resolve()),
  workspaceState = createMockMemento(),
  credentials = testCredentialsWithStub(),
  jsonValidator = new JsonValidator(),
}: {
  extensionPath?: string;
  workspaceStoragePath?: string;
  globalStoragePath?: string;
  createEventEmitter?: <T>() => AppEventEmitter<T>;
  executeCommand?: () => Promise<void>;
  workspaceState?: Memento;
  credentials?: Credentials;
  jsonValidator?: JsonValidator;
}): App {
  return {
    mode: AppMode.Test,
    logger: createMockLogger(),
    subscriptions: [],
    extensionPath,
    workspaceStoragePath,
    globalStoragePath,
    workspaceState,
    createEventEmitter,
    executeCommand,
    credentials,
    jsonValidator,
  };
}

export class MockAppEventEmitter<T> implements AppEventEmitter<T> {
  public event: AppEvent<T>;

  constructor() {
    this.event = () => {
      return {} as Disposable;
    };
  }

  public fire(): void {
    // no-op
  }
}
