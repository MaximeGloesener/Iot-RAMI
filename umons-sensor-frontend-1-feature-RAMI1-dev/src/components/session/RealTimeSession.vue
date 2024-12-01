<template>
	<div class="create-session-container">
		<h1>Créer une nouvelle session</h1>

		<!-- Étape 1 : Choix du capteur -->
		<div
			class="step"
			:class="{ active: activeStep === 1 }">
			<h2 @click="toggleStep(1)">
				<span>Étape 1: Choix du capteur</span>
				<span
					class="arrow"
					:class="{ down: activeStep === 1 }"
					>▼</span
				>
			</h2>
			<div
				class="step-content"
				v-if="activeStep === 1">
				<SensorsList :isForRealTimeSession="true" />
				<div class="sensor-info">
					<p>You cannot click on a sensor that is not online{{ selectedSensorName }}</p>
				</div>
			</div>
		</div>

		<!-- Étape 2 : Initialisation de la session -->
		<div
			class="step"
			:class="{ active: activeStep === 2 }">
			<h2 @click="toggleStep(2)">
				<span>Étape 2: Initialisation de la session</span>
				<span
					class="arrow"
					:class="{ down: activeStep === 2 }"
					>▼</span
				>
			</h2>
			<div
				class="step-content"
				v-if="activeStep === 2">
				<p>Instructions : Assurez-vous que le capteur est correctement configuré et prêt à l'emploi.</p>
				<button
					@click="startSession"
					class="submit-button">
					Commencer la session
				</button>
			</div>
		</div>

		<!-- Étape 3 : Déroulement de la session -->
		<div
			class="step"
			:class="{ active: activeStep === 3 }">
			<h2 @click="toggleStep(3)">
				<span>Étape 3: Déroulement de la session</span>
				<span
					class="arrow"
					:class="{ down: activeStep === 3 }"
					>▼</span
				>
			</h2>
			<div
				class="step-content"
				v-if="activeStep === 3">
				<div class="graph-container">
					<Graph :isRealTime="true" />
				</div>
				<div class="info-columns">
					<div class="info-box">
						<p>Dernière valeur reçue : il y a {{ timeSinceLastValue.toFixed(3) }} secondes</p>
					</div>
					<div class="info-box">
						<p>Vitesse de transmission : {{ transmissionSpeed.toFixed(3) }} valeurs/seconde</p>
					</div>
				</div>
				<button
					@click="endCurrentSession"
					class="stop-button">
					Arrêter la session
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { ref, provide, defineComponent, onMounted, onUnmounted } from "vue"
	import Graph from "@/components/session/Graph.vue"
	import SensorsList from "@/components/sensor/SensorsList.vue"
	import { EventTypes, UserFields, handleEvent } from "@/composables/useUser.composable"
	import { useSession } from "@/composables/useSession.composable"
	import type { CreateClientSideSessionRequestBody } from "#/session"

	export default defineComponent({
		name: "CreateSession",
		components: {
			Graph,
			SensorsList,
		},
		setup() {
			const { idUser, idSensor, chartData, timeSinceLastValue, transmissionSpeed, startSessionOnClientSide, createSessionOnServerSide } = useSession()

			const activeStep = ref(1)
			const selectedSensorName = ref("")

			provide("title", "Current session chart")
			provide("chartData", chartData)

			const sensorSelectedCallback = (sensorId: string) => {
				const storedId = localStorage.getItem(UserFields.ID)

				if (storedId !== null) {
					idUser.value = storedId
				}
				idSensor.value = sensorId
				nextStep()
			}

			onMounted(() => {
				handleEvent("on", EventTypes.SENSOR_SELECTED_FOR_CREATING_SESSION, sensorSelectedCallback)
			})

			onUnmounted(() => {
				handleEvent("off", EventTypes.SENSOR_SELECTED_FOR_CREATING_SESSION, sensorSelectedCallback)
			})

			const nextStep = () => {
				if (activeStep.value < 3) {
					activeStep.value += 1
				}
			}

			const toggleStep = (step: number) => {
				if (activeStep.value === step) {
					activeStep.value = 0
				} else {
					activeStep.value = step
				}
			}

			const startSession = async () => {
				try {
					await startSessionOnClientSide({
						idUser: idUser.value,
						idSensor: idSensor.value,
					} as CreateClientSideSessionRequestBody)
					nextStep()
				} catch (error) {
					console.error("Erreur lors du démarrage de la session:", error)
				}
			}

			const endCurrentSession = async () => {
				try {
					await createSessionOnServerSide()
					console.log("Session terminée avec succès")
				} catch (error) {
					console.error("Erreur lors de la tentative de fin de la session:", error)
				}
			}

			return {
				activeStep,
				selectedSensorName,
				chartData,
				timeSinceLastValue,
				transmissionSpeed,
				startSession,
				endCurrentSession,
				toggleStep,
			}
		},
	})
</script>

<style scoped>
	.create-session-container {
		width: 100%;
		margin: 0 auto;
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 10px;
		background-color: #fff;
	}

	.step {
		margin-bottom: 20px;
		background-color: #fff;
		border-radius: 10px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		transition: max-height 0.2s ease-out;
	}

	.step h2 {
		cursor: pointer;
		padding: 15px;
		margin: 0;
		font-size: 1.2em;
		background-color: #f5f5f5;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.step h2 .arrow {
		transition: transform 0.2s;
	}

	.step h2 .arrow.down {
		transform: rotate(180deg);
	}

	.step-content {
		padding: 20px;
		border-top: 1px solid #ddd;
	}

	.sensor-info {
		margin-top: 10px;
	}

	.submit-button {
		display: inline-block;
		padding: 10px 20px;
		background-color: #4caf50;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	.submit-button:hover {
		background-color: #45a049;
	}

	.stop-button {
		display: inline-block;
		padding: 10px 20px;
		background-color: #f44336;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	.stop-button:hover {
		background-color: #e53935;
	}

	.slider-container {
		margin-top: 20px;
	}

	.slider {
		width: 100%;
	}

	.graph-container {
		margin-top: 20px;
		height: 1000px;
	}

	.end-session {
		margin-top: 10px;
	}

	.info-columns {
		display: flex;
		justify-content: space-between;
	}

	.info-box {
		background-color: #fff;
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 5px;
		width: 48%;
		text-align: center;
	}
</style>
