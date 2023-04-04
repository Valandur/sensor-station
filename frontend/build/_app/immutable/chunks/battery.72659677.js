import{g as t}from"./urql-svelte.2b4923b5.js";const r=t`
	fragment BatteryStatus on Query {
		battery {
			status {
				isFault
				isButton
				status
				charge
				temperature
				powerIn {
					state
					voltage
					current
				}
				powerIn5vIo {
					state
					voltage
					current
				}
				fault {
					buttonPowerOff
					forcedPowerOff
					forcedSysPowerOff
					watchdogReset
					batteryProfileInvalid
					chargingTemperatureFault
				}
			}
		}
	}
`;export{r as B};
