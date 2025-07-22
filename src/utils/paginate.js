module.exports = async function paginate(model, query = {}, options = {}) {
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;

  const totalDocuments = await model.countDocuments(query);

  const results = await model
    .find(query)
    .sort(options.sort || {}) // ✅ Apply sorting if provided
    .skip(skip)
    .limit(limit)
    .select(options.select || "") // ✅ Optional: support field selection
    .populate(options.populate || "");

  return {
    status: true,
    currentPage: page,
    totalPages: Math.ceil(totalDocuments / limit),
    totalResults: totalDocuments,
    results: results.length,
    data: results,
  };
};
