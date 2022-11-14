<template>
  <input
    ref="fileInput"
    class="hidden"
    type="file"
    accept=".jpeg,.jpg,.png,.gif,image/jpeg,image/png"
    @change="onFileSelect"
  >
</template>

<script>
const UPLOAD_URL = 'https://api.cloudinary.com/v1_1/agrabah/upload'

export default {
  name : 'b-image-upload',
  props: {
    folderName: {
      type   : String,
      default: null,
    },
    uploadPreset: {
      type   : String,
      default: 'avatar',
    },
  },
  methods: {
    selectFile () {
      this.$refs.fileInput.click()
    },
    onFileSelect (e) {
      const file = e.target.files[0]

      if (!file) return

      this.$emit('file-selected')

      this.getFileAsDataUrl(file)
        .then(this.uploadImage)
        .then((img) => {
          this.$emit('input', img.public_id)
        })
        .catch(this.$handleError)
    },
    getFileAsDataUrl (file) {
      return new Promise((resolve) => {
        const reader = new FileReader()

        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
    },
    uploadImage (image) {
      const data = JSON.stringify({
        public_id_prefix: this.folderName || this.uploadPreset,
        api_key         : process.env.CLOUDINARY_CLOUD_NAME,
        file            : image,
        upload_preset   : this.uploadPreset,
      })

      return fetch(UPLOAD_URL, {
        method : 'POST',
        body   : data,
        headers: { 'Content-Type': 'application/json' },
      })
        .then((data) => {
          const json = data.json()

          if (!data.ok) throw json

          return json
        })
    },
  },
}
</script>
