exports = module.exports = function(user, q) {
  if (user && user.isAdmin) {
    return q;
  } else {
    return q.where({
      state: 'published',
      publishedDate: { $lte: new Date() },
    });
  }
};
