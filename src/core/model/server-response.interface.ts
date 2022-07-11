export interface ObjectValue<T> {
    DataBeanProperties: T;
    DataBeanName: string;
  }
  
  export interface DataBeanProperties<T> {
    Type: number;
    ObjectValue: ObjectValue<T>[];
    ClassName: string;
    Date: string;
  }
  
  export interface ServerResponse<T> {
    DataBeanProperties: DataBeanProperties<T>;
    DataBeanName: string;
  }