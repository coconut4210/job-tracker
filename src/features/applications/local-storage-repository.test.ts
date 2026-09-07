import { LocalStorageApplicationRepository } from "./local-storage-repository";
import { records } from "./test-data";

beforeEach(() => localStorage.clear());

test("saves, lists, and removes records", async () => {
  const repository = new LocalStorageApplicationRepository();
  await repository.save(records[0]);
  expect(await repository.list()).toEqual([records[0]]);
  for (const record of records) await repository.remove(record.id);
  expect(await repository.list()).toEqual([]);
});

test("replaces a record with the same id", async () => {
  const repository = new LocalStorageApplicationRepository();
  await repository.save(records[0]);
  await repository.save({ ...records[0], status: "Offer" });
  expect((await repository.list())[0].status).toBe("Offer");
});

test("recovers from invalid stored data", async () => {
  localStorage.setItem("job-tracker.applications.v1", "not-json");
  expect(await new LocalStorageApplicationRepository().list()).toEqual([]);
});

test("uses seed data only before storage is initialized", async () => {
  const repository = new LocalStorageApplicationRepository(records);
  expect(await repository.list()).toEqual(records);
  for (const record of records) await repository.remove(record.id);
  expect(await repository.list()).toEqual([]);
});
