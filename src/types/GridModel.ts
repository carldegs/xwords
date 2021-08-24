import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';

// TODO: Create own model
export class Clue {
  @prop()
  public clue?: string;

  @prop()
  public answer?: string[];
}

export class RootCellDir {
  @prop({ required: true })
  public length: number;

  @prop()
  public clue?: Ref<Clue>;
}

export class RootCell {
  @prop({ required: true })
  public x: number;

  @prop({ required: true })
  public y: number;

  @prop()
  public index?: number;

  @prop()
  public across?: RootCellDir;

  @prop()
  public down?: RootCellDir;
}

export class Position {
  @prop({ required: true })
  public x: number;

  @prop({ required: true })
  public y: number;
}

@modelOptions({
  schemaOptions: { collection: 'grids' },
})
export class GridInterface {
  @prop({ required: true, min: 1 })
  public rows: number;

  @prop({ required: true, min: 1 })
  public cols: number;

  @prop({ required: true, type: () => RootCell, _id: false })
  public rootCells: RootCell[];

  @prop({ required: true, type: () => Position, _id: false })
  public blocks: Position[];
}

const GridModel = getModelForClass(GridInterface);

export default GridModel;
