import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

export class Clue {
  @prop()
  public clue?: string;

  @prop()
  public answer?: string[];
}

export class RootCell {
  @prop({ required: true })
  public x: number;

  @prop({ required: true })
  public y: number;

  @prop({ required: true })
  public across: Clue;

  @prop({ required: true })
  public down: Clue;
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
