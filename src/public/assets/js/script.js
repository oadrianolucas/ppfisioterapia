$(document).ready(() => {
  const alertOptions = {
    animation: true,
    delay: 20000,
  }

  console.log("Document body:", document.body)
  const alertElement = document.querySelector(".toast")
  console.log("Alert element:", alertElement)
  if (alertElement) {
    const toast = new bootstrap.Toast(alertElement, alertOptions)
    toast.show()
  }

  // Function to populate fields with data
  const populateFieldsWithData = (result) => {
    for (const campo in result) {
      const campoElement = document.querySelector(`#${campo}`)
      if (campoElement) {
        campoElement.value = result[campo]
      }
    }
  }

  // Masking input fields
  $("#phone").mask("(99)99999-9999")
  $("#cep").mask("99999-999")
  $("#cpf").mask("999.999.999-99")

  const cepInput = document.querySelector("#cep")
  cepInput.addEventListener("blur", async () => {
    const search = cepInput.value.replace("-", "")
    const fetchOptions = {
      method: "GET",
      mode: "cors",
      cache: "default",
    }

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${search}/json/`,
        fetchOptions
      )
      const data = await response.json()
      populateFieldsWithData(data)
    } catch (error) {
      console.error("Error:", error.message)
    }
  })

  $(".chosen").chosen({ no_results_text: "Nenhuma opção encontrada:" })
})
