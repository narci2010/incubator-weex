import fs from 'fs'
import path from 'path'

// load test driver
import {
  Runtime,
  Instance
} from 'weex-vdom-tester'

// load env
import '../../shared'
import { Document, Element, Comment } from '../../runtime/vdom'
import Listener from '../../runtime/listener'

// load framework
import * as defaultFramework from '../../frameworks/legacy'
import { subversion } from '../../../package.json'

// mock config & global APIs
global.callNativeHandler = function () {}

// init special API called `callAddElement()`
// which is supported temporarily in native render
global.callAddElement = function (id, ref, json, index) {
  return callNativeHandler(id, [{ module: 'dom', method: 'addElement', args: [ref, json, index] }])
}

// create test driver runtime
export function createRuntime () {
  const config = {
    Document, Element, Comment, Listener,
    sendTasks (...args) {
      return callNativeHandler(...args)
    }
  }

  Document.Listener = Listener
  Document.handler = config.sendTasks

  defaultFramework.init(config)

  Object.assign(global, {
    frameworkVersion: subversion.native,
    transformerVersion: subversion.transformer
  })

  return new Runtime(defaultFramework)
}

// create framework instance
export function createApp (runtime) {
  return new Instance(runtime)
}

// read source code from file
export function getCode (filePath) {
  const absolutPath = path.join(__dirname, filePath)
  return fs.readFileSync(absolutPath, 'utf8')
}