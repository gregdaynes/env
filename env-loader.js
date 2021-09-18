#!/usr/bin/env node

const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const envSchema = require('env-schema')
const schema = require('./env-schema.js')

function dotenvTest(config) {
  const environment = config.ignoreProcessEnv ? {} : process.env
  if (environment.NODE_ENV !== 'test') return config

  if (config.parsed) {
    for (const [key, value] of Object.entries(config.parsed)) {
      if (!key.startsWith('TEST_')) continue

      const processKey = key.replace('TEST_', '')

      environment[`${processKey}`] = value
    }
  }

  return config
}

function dotenvValidate(config) {
  const environment = config.ignoreProcessEnv ? {} : process.env

  try {
    const x = envSchema({
      schema,
      data: environment,
    })

    config.parsed = Object.assign(config.parsed, x)

    for (const [key, value] of Object.entries(x)) {
      environment[`${key}`] = value
    }
  } catch (err) {
    console.error('.' + err.message)
    process.exit(1)
  }

  return config
}

const env = dotenv.config()
dotenvExpand(env)
dotenvTest(env)

module.exports = dotenvValidate(env).parsed
