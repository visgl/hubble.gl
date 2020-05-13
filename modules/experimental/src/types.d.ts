interface KeplerSceneParams {
  animationLoop: any
  length: number
  keyframes: any[]
  data: any
  filters: any[]
  getFrame: (keplerGl: any, keyframes: any[], filters: any[]) => any
}