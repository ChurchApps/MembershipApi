export * from './schema.types'
export * from './server.types'

// -- AddForeignKey
// ALTER TABLE `groupMembers` ADD FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

// -- AddForeignKey
// ALTER TABLE `groupMembers` ADD FOREIGN KEY (`personId`) REFERENCES `people`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
