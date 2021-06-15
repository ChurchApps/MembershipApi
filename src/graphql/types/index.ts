export * from './SchemaTypes'
export * from './ServerTypes'

// -- AddForeignKey
// ALTER TABLE `groupMembers` ADD FOREIGN KEY (`groupId`) REFERENCES `groups`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

// -- AddForeignKey
// ALTER TABLE `groupMembers` ADD FOREIGN KEY (`personId`) REFERENCES `people`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
