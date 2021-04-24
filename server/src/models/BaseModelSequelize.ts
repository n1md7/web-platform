export default abstract class BaseModelSequelize<T> {

    protected model;
    protected tableName;

    protected constructor(model:T, table: string) {
        this.model = model;
        this.tableName = table;
    }

}
