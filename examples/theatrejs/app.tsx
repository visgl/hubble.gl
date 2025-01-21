/* eslint-disable no-unused-vars */
import React from 'react';
import {createRoot} from 'react-dom/client';
import DeckGL from '@deck.gl/react';
import {ScatterplotLayer, BitmapLayer} from '@deck.gl/layers';
import {TileLayer} from '@deck.gl/geo-layers';
import studio from '@theatre/studio'

import { getProject, ISheet, ISheetObject, types, UnknownShorthandCompoundProps, val } from '@theatre/core'
import { DefaultProps, CompositeLayer, CompositeLayerProps, Layer } from '@deck.gl/core'
import { Color, UpdateParameters } from 'deck.gl';

studio.initialize()

// Create a project for the animation
const project = getProject('deck.gl x Theatre.js')

// Create a sheet
const sheet = project.sheet('Animated scene')

const PROP_STRING_LITERAL = {
  radiusUnits: {'meters': 'meters', 'pixels': 'pixels', 'common': 'common'},
  lineWidthUnits: {'meters': 'meters', 'pixels': 'pixels', 'common': 'common'},
  refinementStrategy: {'best-available': 'best-available'}
}

function parseProp(key, value) {
  switch (typeof value) {
    case 'boolean': {
      return types.boolean(value)
    }
    case 'string': {
      if (key in PROP_STRING_LITERAL) {
        return types.stringLiteral(value, PROP_STRING_LITERAL[key])
      } else {
        console.warn('Missing string literal: ', key, value)
      }
      break;
    }
    case 'number': {
      return types.number(value)
    }
    case 'object': {
      // 
      if(value?.type === 'number') {
          return types.number(value.value)
          // return types.number(value.value, {
          //   range: [
          //     typeof value.min !== 'undefined' ? value.min : Number.MIN_SAFE_INTEGER, 
          //     typeof value.max !== 'undefined' ? value.max : Number.MAX_SAFE_INTEGER
          //   ]
          // })
      } else if (value?.type === 'accessor') {
        if (typeof value.value === 'number') {
          return types.number(value.value)
        } else if(Array.isArray(value.value)) {
          return types.rgba(colorToRgba(value.value))
        } else {
          console.warn("unable to parse accessor prop:", key, value)
        }
      } else {
        console.warn("unable to parse object prop:", key, value)
      }
      break;
    }
    default: {
      console.warn("unable to parse prop:", key, value)
    }
  }
}

const PROP_BLACK_LIST = ['dataComparator', 'fetch'];
const BASE_LAYER_PROP_WHITE_LIST = [
  'autoHighlight',
  'coordinateOrigin',
  'coordinateSystem',
  'highlightColor',
  'modelMatrix',
  'opacity',
  'pickable',
  'visible',
  'wrapLongitude'
];

function isClass(obj) {
  const isCtorClass = obj.constructor
      && obj.constructor.toString().substring(0, 5) === 'class'
  if(obj.prototype === undefined) {
    return isCtorClass
  }
  const isPrototypeCtorClass = obj.prototype.constructor 
    && obj.prototype.constructor.toString
    && obj.prototype.constructor.toString().substring(0, 5) === 'class'
  return isCtorClass || isPrototypeCtorClass
}

function testIfSkip(Class: typeof Layer, propDef, propKey: string, animatedLayer: AnimatedLayer) {
  let shouldSkip = false;

  // Hide deprecated props
  shouldSkip = propDef && propDef.deprecatedFor;

  // Hide null props
  shouldSkip = shouldSkip || propDef === null || (typeof propDef === 'object' && propDef.value === null)

  // Hide classes
  shouldSkip = shouldSkip || isClass(propDef)

  // // Hide experimental props
  // shouldSkip = shouldSkip || key.startsWith('_');

  // Hide accessors that are not exposed, e.g. `getPolygon` in `H3HexagonLayer`
  shouldSkip =
    shouldSkip ||
    (propDef && propDef.type === 'accessor' && typeof propDef.value === 'function');
  
  // Hide some base layer props
  shouldSkip =
    shouldSkip ||
    (Class.layerName === 'Layer' && !BASE_LAYER_PROP_WHITE_LIST.includes(propKey));

  // Hide default callbacks, e.g. `onTileError`
  shouldSkip = shouldSkip || (propDef && typeof propDef.value === 'function')

  // Hide controlled props
  shouldSkip = shouldSkip || typeof animatedLayer.props[propKey] !== 'undefined'

  // console.log(propKey, propDef)

  return shouldSkip
}

type RGBA = { r: number; g: number; b: number; a: number }
type RGBX = { r: number; g: number; b: number; a?: number }
type Rgba = Parameters<typeof types.rgba>[0] | RGBA

function colorToRgba([r, g, b, a = 255]: number[] | Color): Rgba {
  return {
    r: r / 255,
    g: g / 255,
    b: b / 255,
    a: a / 255,
  }
}

function rgbaToColor({r, b, g, a = 1}: RGBX): Color {
  return [r * 255, g * 255, b * 255, a * 255].map(Math.round) as Color
}

const defaultProps: DefaultProps<AnimatedLayerProps> = {
  data: {type: 'data', value: []},
  LayerClass: null,
  propTypes: null,
  sheet: null
}

interface ConstructorOf<T> {
  new (...args: any): T;
}

type ConcreteConstructor<T extends abstract new (...args: any) => any> =
  (T extends abstract new (...args: infer A) => infer R ? 
    new (...args: A) => R : never) & T;


    // new(...args: any)=>Layer

export type AnimatedLayerProps<LayerClassT extends ConcreteConstructor<typeof Layer> = any> = CompositeLayerProps & _AnimatedLayerProps<LayerClassT>;

type _AnimatedLayerProps<LayerClassT extends ConcreteConstructor<typeof Layer>> = {
  Class: LayerClassT;
  propTypes?: {[key: string]: types.PropTypeConfig}
  sheet: ISheet
} & LayerClassT["defaultProps"]

class AnimatedLayer<LayerClassT extends ConcreteConstructor<typeof Layer>> extends CompositeLayer<Required<_AnimatedLayerProps<LayerClassT>>> {
  static defaultProps: DefaultProps = defaultProps;
  static layerName = 'AnimatedLayer';

  initializeState(): void {
    const {sheet, Class} = this.props;
    const sheetObject = this.getSheetObject(sheet);

    const propValues = {}
    const keys = Object.keys(Class.defaultProps).sort();
    for (const key of keys) {
      if (key in sheetObject.value) {
        let value = val(sheetObject.props[key])
        // if (typeof value === 'object') {
        //   console.log(value)
        //   value = rgbaToColor(value)
        // }
        propValues[key] = value
      }
    }
    console.log("initial values",sheetObject, propValues)

    this.state = {
      sheetObject,
      propValues
    };

    sheetObject.onValuesChange((newValues) => {
      for (const [key, value] of Object.entries(newValues)) {
        if (typeof value === 'object') {
          console.log(key, value)
          newValues[key] = rgbaToColor(value)
        }
      }
      console.log("new values", newValues)
      this.setState({
        propValues: {...this.state.propValues, ...newValues}
      })
    })
  }
  
  getSheetObject(sheet: ISheet): ISheetObject {
    const {id, Class, propTypes} = this.props;
    console.log(Class.defaultProps)

    const theatreProps: {[key: string]: types.PropTypeConfig} = {}

    const keys = Object.keys(Class.defaultProps).sort();
    for (const propKey of keys) {
      const propDef = Class.defaultProps[propKey];
      if (!testIfSkip(Class, propDef, propKey, this)) {
        theatreProps[propKey] = parseProp(propKey, propDef)
      }
    }
    console.log('theatre props', theatreProps)
    return sheet.object(`${id} (${Class.layerName})`, {...theatreProps, ...propTypes})
  }

  renderLayers(): Layer | null {
    const { id, Class, propTypes, sheet, ...layerProps } = this.props;
    const { propValues } = this.state;

    console.log("render prop values", propValues)
    console.log("render layer props", layerProps)

    return new (Class as ConstructorOf<Layer>)(
      this.getSubLayerProps({
        id: Class.layerName
      }),
      propValues,
      layerProps
    )
  }
}

type BartStation = {
  name: string;
  entries: number;
  exits: number;
  coordinates: [longitude: number, latitude: number];
};

export default function App() {
  const scatterLayer = new ScatterplotLayer<BartStation>({
    id: 'ScatterplotLayer',
    data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json',
    
    stroked: true,
    getPosition: (d: BartStation) => d.coordinates,
    getRadius: (d: BartStation) => Math.sqrt(d.exits),
    getFillColor: [255, 140, 0],
    getLineColor: [0, 0, 0],
    getLineWidth: 10,
    radiusScale: 6
  });

  // const tileLayer = new TileLayer({
  //   id: 'TileLayer',
  //   data: 'https://cdn.lima-labs.com/{z}/{x}/{y}.png?api=demo',
  //   maxZoom: 19,
  //   minZoom: 0,

  //   renderSubLayers: props => {
  //     const {boundingBox} = props.tile;

  //     return new BitmapLayer(props, {
  //       data: null,
  //       image: props.data,
  //       bounds: [boundingBox[0][0], boundingBox[0][1], boundingBox[1][0], boundingBox[1][1]]
  //     });
  //   }
  // });

  const tileLayer = new AnimatedLayer({
    Class: TileLayer,
    sheet,
    id: 'TileLayer',
    data: 'https://cdn.lima-labs.com/{z}/{x}/{y}.png?api=demo',
    maxZoom: 19,
    minZoom: 0,

    renderSubLayers: props => {
      const {boundingBox} = props.tile;

      return new BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [boundingBox[0][0], boundingBox[0][1], boundingBox[1][0], boundingBox[1][1]]
      });
    }
  });

  const animatedLayer = new AnimatedLayer<typeof ScatterplotLayer>({
    id: 'AnimatedLayer',
    Class: ScatterplotLayer,
    sheet,
    data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json',
    
    // stroked: true,
    getPosition: (d: any) => d.coordinates,
    // getRadius: (d: any) => Math.sqrt(d.exits),
    // getFillColor: [255, 140, 0],
    // getLineColor: [0, 0, 0],
    // getLineWidth: 10,
    // radiusScale: 6,
  })

  return (
    <DeckGL
      initialViewState={{
        longitude: -122.4,
        latitude: 37.74,
        zoom: 11
      }}
      controller
      layers={[tileLayer, animatedLayer]}
    />
  );
}

export function renderToDOM(container: HTMLDivElement) {
  createRoot(container).render(<App />);
}
