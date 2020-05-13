import {ArcLayer} from '@deck.gl/layers';
import {Model, Geometry} from '@luma.gl/core';
import GL from '@luma.gl/constants';

import vertexShader from './progress-arc-layer-vertex.glsl';

const NUM_SEGMENTS = 1000;

export default class ProgressArcLayer extends ArcLayer {
  initializeState() {
    super.initializeState();

    const attributeManager = this.getAttributeManager();

    attributeManager.addInstanced({
      instanceProgressions: {
        size: 2,
        transition: true,
        accessor: 'getProgression',
        defaultValue: [0, 1]
      }
    });
  }

  _getModel(gl) {
    let positions = [];
    /*
     *  (0, -1)-------------_(1, -1)
     *       |          _,-"  |
     *       o      _,-"      o
     *       |  _,-"          |
     *   (0, 1)"-------------(1, 1)
     */
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      positions = positions.concat([i, -1, 0, i, 1, 0]);
    }

    const model = new Model(
      gl,
      Object.assign({}, this.getShaders(), {
        id: this.props.id,
        geometry: new Geometry({
          drawMode: GL.TRIANGLE_STRIP,
          attributes: {
            positions: new Float32Array(positions)
          }
        }),
        isInstanced: true,
        shaderCache: this.context.shaderCache
      })
    );

    model.setUniforms({
      numSegments: NUM_SEGMENTS
    });

    return model;
  }

  getShaders() {
    return Object.assign({}, super.getShaders(), {
      vs: vertexShader
    });
  }

  draw(opts) {
    const {uniforms} = opts;

    super.draw({
      ...opts,
      uniforms: {
        ...uniforms,
        numSegments: NUM_SEGMENTS
      }
    });
  }
}

ProgressArcLayer.defaultProps = Object.assign({}, ArcLayer.defaultProps, {
  getProgression: {type: 'accessor', value: 1}
});
