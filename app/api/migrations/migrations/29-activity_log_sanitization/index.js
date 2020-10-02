import { BODY_REQUIRED_ENDPOINTS, IGNORED_ENDPOINTS } from 'api/activitylog/activitylogMiddleware';

export default {
  delta: 29,

  name: 'activity_log_sanitization',

  description: 'remove activity log entries that do not contain relevant content',

  async up(db) {
    process.stdout.write(`${this.name}...\r\n`);
    const deletedEntriesByMethod = await db
      .collection('activitylogs')
      .deleteMany({ method: { $in: ['GET', 'OPTIONS', 'HEAD'] } });
    process.stdout.write(
      `${deletedEntriesByMethod.result.n} activity log entries deleted with unneeded methods\r\n`
    );

    const deletedEntriesByEndpoint = await db
      .collection('activitylogs')
      .deleteMany({ url: { $in: IGNORED_ENDPOINTS } });
    process.stdout.write(
      `${deletedEntriesByEndpoint.result.n} activity log entries deleted with unneeded endpoints\r\n`
    );

    const deletedUploadEntriesWithoutBody = await db
      .collection('activitylogs')
      .deleteMany({ url: { $in: BODY_REQUIRED_ENDPOINTS }, body: '{}' });
    process.stdout.write(
      `${deletedUploadEntriesWithoutBody.result.n} activity log POST entries deleted with empty bodies\r\n`
    );

    process.stdout.write('\r\n');
  },
};
