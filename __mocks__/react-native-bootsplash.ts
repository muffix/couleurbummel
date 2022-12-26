export default {
  hide: jest.fn().mockResolvedValueOnce(null),
  getVisibilityStatus: jest.fn().mockResolvedValue('hidden'),
};
