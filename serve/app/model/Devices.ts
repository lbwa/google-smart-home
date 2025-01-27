export default function(app) {
  const { mongoose } = app
  const { Schema } = mongoose
  const DeviceSchema = new Schema({
    id: Schema.Types.ObjectId,
    type: String,
    traits: [String],
    name: String,
    defaultNames: [String],
    nicknames: [String],
    willReportState: Boolean,
    attributes: {
      /**
       * @description Smart Home Toggles Trait Schema
       * DOC: https://developers.google.com/actions/smarthome/traits/toggles#device-attributes
       */
      availableToggles: [
        {
          name: String,
          name_values: [
            {
              name_synonym: [String],
              lang: String
            }
          ]
        }
      ],
      cameraStreamNeedAuthToken: Boolean,
      cameraStreamNeedDrmEncryption: Boolean,
      cameraStreamSupportedProtocols: [String]
    },
    hwVersion: String,
    swVersion: String,
    manufacturer: String,
    model: String
  })

  /**
   * @description Mongoose automatically looks for the plural, lowercased version of your model name
   *
   * @doc: https://mongoosejs.com/docs/models.html#compiling
   */
  return mongoose.model('devices', DeviceSchema)
}
