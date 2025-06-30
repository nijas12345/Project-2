import mongoose, {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from "mongoose";

class BaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  // ✅ Create
  createData = async (data: Partial<T>): Promise<T> => {
    try {
      const createData = await this.model.create(data);
      console.log(createData);

      return createData;
    } catch (error) {
      throw error;
    }
  };

  // ✅ Find one
  findOne = async (
    filter: FilterQuery<T>,
    projection: ProjectionType<T> = {},
    options: QueryOptions = {}
  ): Promise<T | null> => {
    try {
      return await this.model.findOne(filter, projection, options);
    } catch (error) {
      throw error;
    }
  };

  findByIdAndUpdate = async (
    id: string | mongoose.Types.ObjectId,
    update: UpdateQuery<T>,
    options: QueryOptions = { new: true }
  ): Promise<T | null> => {
    try {
      const objectId =
        typeof id === "string" ? new mongoose.Types.ObjectId(id) : id;
      return await this.model.findByIdAndUpdate(objectId, update, options);
    } catch (error) {
      throw error;
    }
  };

  // ✅ Find all
  findAll = async (
    filter: FilterQuery<T> = {},
    projection: ProjectionType<T> = {},
    options: QueryOptions = {}
  ): Promise<T[]> => {
    try {
      return await this.model.find(filter, projection, options);
    } catch (error) {
      throw error;
    }
  };

  // ✅ Find by ID
  findById = async (
    id: string | mongoose.Types.ObjectId,
    projection: ProjectionType<T> = {},
    options: QueryOptions = {}
  ): Promise<T | null> => {
    try {
      const objectId =
        typeof id === "string" ? new mongoose.Types.ObjectId(id) : id;
      return await this.model.findById(objectId, projection, options);
    } catch (error) {
      throw error;
    }
  };

  // ✅ Find one and update (returns updated)
  findOneAndUpdate = async (
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options: QueryOptions = { new: true }
  ): Promise<T | null> => {
    try {
      return await this.model.findOneAndUpdate(filter, update, options);
    } catch (error) {
      throw error;
    }
  };

  // ✅ Delete one
  deleteOne = async (filter: FilterQuery<T>): Promise<void> => {
    try {
      await this.model.deleteOne(filter);
    } catch (error) {
      throw error;
    }
  };
}

export default BaseRepository;
