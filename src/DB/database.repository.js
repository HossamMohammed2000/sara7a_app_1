export const findOne = async (
  model,
  select = "",
  filter = {},
  Options = {},
) => {
  let doc = model.findOne(filter);
  if (select?.length) {
    doc = doc.select(select);
  }
  if (Options?.populate) {
    doc = doc.populate(Options.populate);
  }
  if (Options?.lean) {
    doc = doc.lean();
  }
  return await doc.exec();
};

export const findById = async (model, id, select = "", Options = {}) => {
  let doc = model.findById(id).select(select || "");
  if (Options?.populate) {
    doc = doc.populate(Options.populate);
  }
  if (Options?.lean) {
    doc = doc.lean();
  }
  return await doc.exec();
};

export const find = async (model, filter, select = "", Options = {}) => {
  let doc = model.find(filter).select(select || "");
  if (Options?.populate) {
    doc = doc.populate(Options.populate);
  }
  if (Options?.lean) {
    doc = doc.lean();
  }
  if (Options?.limit) {
    doc = doc.limit(Options.limit);
  }
  if (Options?.skip) {
    doc = doc.skip(Options.skip);
  }
  return await doc.exec();
};

export const create = async (
  model,
  data,
  options = { validateBeforeSave: true },
) => {
  const [doc] = (await model.create([data], options)) || [];
  return doc;
};

export const insertMany = async (model, data) => {
  return await model.insertMany(data);
};

export const updateOne = async (model, filter = {}, update, options) => {
  return await model.updateOne(
    filter,
    { ...update, $inc: { __v: 1 } },
    options,
  );
};

export const findOneAndUpdate = async (model, filter = {}, update, options) => {
  return await model.findOneAndUpdate(
    filter || {},
    {
      ...update,
      $inc: {
        ...(update?.$inc || {}),
        __v: 1,
      },
    },
    {
      new: true,
      runValidators: true,
      ...(options || {}),
    },
  );
};

export const findByIdAndUpdate = async (
  model,
  id = "",
  update,
  options = {},
) => {
  return await model.findByIdAndUpdate(
    id,
    { ...update, $inc: { __v: 1 } },
    { new: true, runValidators: true, ...options },
  );
};

export const deleteOne = async (model, filter = {}) => {
  return await model.deleteOne(filter);
};

export const deleteMany = async (model, filter = {}) => {
  return await model.deleteMany(filter);
};

export const findOneAndDelete = async (model, filter = {}) => {
  return await model.findOneAndDelete(filter);
};
