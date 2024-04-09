# forts'tt med Banksajt men sql coh docker

## instruktioner

Ni ska använda docker för att publicera er banksajt på AWS.

Gå igenom de två föreläsningarna om docker för att förbereda er.

Övergripande steg:

1. Skapa Dockerfiles till backend och frontend projekten.
2. Skapa docker-compose.yml fil i roten av projektet som inkluderar mysql-databas.
3. Lägg till en volume för databasen så att inte datat raderas när ni startar om containern.

4. Se till att url-erna i fetch i er frontend pekar på urlen till er ec2 instans.
5. Skicka filerna till er instans med scp

6. Installera docker på er ec2 instans

7. Kör docker på er ec2 instans

8. Exportera tabellerna från er lokala databas och importera dom till databasen på aws.
   Använd Sequel Ace (Mac) eller mySQLWorkbench (Windows) för detta.

9. Lämna in länken till er banksajt på canvas.
#   c h a s _ b a n k s a j t _ d o c k e r  
 